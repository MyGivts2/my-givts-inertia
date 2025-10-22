<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class FetchBolProducts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:fetch-bol-products';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        //
    }

    public function downloadAndUnzipFeed()
    {
        $ftp = ftp_ssl_connect(env('FTP_HOST'), env('FTP_PORT'));

        if (!$ftp) {
            throw new \Exception('Unable to connect to FTP server');
        }

        $login = ftp_login($ftp, env('FTP_USERNAME'), env('FTP_PASSWORD'));
        if (!$login) {
            ftp_close($ftp);
            throw new \Exception('FTP login failed');
        }

        ftp_pasv($ftp, true);

        // List files
        $files = ftp_nlist($ftp, '.');

        // Pick a file (e.g., first one)
        $remoteFile = $files[0] ?? null;

        if (!$remoteFile) {
            ftp_close($ftp);
            throw new \Exception('No file found on FTP');
        }

        $localPath = storage_path("app/productfeeds/$remoteFile");

        // Ensure directory exists
        if (!is_dir(dirname($localPath))) {
            mkdir(dirname($localPath), 0755, true);
        }

        // Download file
        if (!ftp_get($ftp, $localPath, $remoteFile, FTP_BINARY)) {
            ftp_close($ftp);
            throw new \Exception("Failed to download $remoteFile");
        }

        ftp_close($ftp);

        // Unzip if it is a .zip file
        if (str_ends_with($localPath, '.zip')) {
            $zip = new \ZipArchive();
            if ($zip->open($localPath) === TRUE) {
                $zip->extractTo(storage_path('app/productfeeds/extracted'));
                $zip->close();
            } else {
                throw new \Exception("Failed to unzip the file");
            }
        }

        return 'Download and unzip complete';
    }
}

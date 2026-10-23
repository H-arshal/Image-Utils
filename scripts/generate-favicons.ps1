Add-Type -AssemblyName System.Drawing

$srcPath = "d:\Project\image-utils\public\logo.png"
$src = [System.Drawing.Bitmap]::FromFile($srcPath)

function Resize-Img($source, $w, $h, $destPath) {
    $dest = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($dest)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)
    $g.DrawImage($source, 0, 0, $w, $h)
    $g.Dispose()
    $dest.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $dest.Dispose()
}

Resize-Img $src 16 16 "d:\Project\image-utils\public\favicon-16x16.png"
Resize-Img $src 32 32 "d:\Project\image-utils\public\favicon-32x32.png"
Resize-Img $src 48 48 "d:\Project\image-utils\public\favicon-48x48.png"
Resize-Img $src 96 96 "d:\Project\image-utils\public\favicon-96x96.png"
Resize-Img $src 180 180 "d:\Project\image-utils\public\apple-touch-icon.png"
Resize-Img $src 192 192 "d:\Project\image-utils\public\icon-192.png"
Resize-Img $src 512 512 "d:\Project\image-utils\public\icon-512.png"

$src.Dispose()
Write-Host "Icons generated successfully!"

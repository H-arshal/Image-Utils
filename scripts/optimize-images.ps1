Add-Type -AssemblyName System.Drawing

function Optimize-PngImage {
    param(
        [string]$InputPath,
        [string]$OutputPath,
        [int]$TargetWidth,
        [int]$TargetHeight
    )

    $srcImg = [System.Drawing.Image]::FromFile($InputPath)
    Write-Host "Processing $InputPath ($($srcImg.Width)x$($srcImg.Height)) -> Target: ($TargetWidth x $TargetHeight)"

    $destBmp = New-Object System.Drawing.Bitmap($TargetWidth, $TargetHeight, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $graphics = [System.Drawing.Graphics]::FromImage($destBmp)

    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    $destRect = New-Object System.Drawing.Rectangle(0, 0, $TargetWidth, $TargetHeight)
    $graphics.DrawImage($srcImg, $destRect, 0, 0, $srcImg.Width, $srcImg.Height, [System.Drawing.GraphicsUnit]::Pixel)

    $graphics.Dispose()
    $srcImg.Dispose()

    # Save to a temporary file, then replace
    $tempFile = [System.IO.Path]::GetTempFileName() + ".png"
    $destBmp.Save($tempFile, [System.Drawing.Imaging.ImageFormat]::Png)
    $destBmp.Dispose()

    $origSize = (Get-Item $InputPath).Length
    Copy-Item -Path $tempFile -Destination $OutputPath -Force
    Remove-Item -Path $tempFile -Force
    $newSize = (Get-Item $OutputPath).Length

    Write-Host "Done: $OutputPath"
    Write-Host "Original Size: $origSize bytes -> New Size: $newSize bytes (Saved $([math]::Round(($origSize - $newSize) / 1024, 1)) KiB)"
}

# 1. Optimize Hero & Header icon (Orange Pixel Landscape Icon.png)
# Rendered at 95x95 max on mobile, 54x54 on desktop. 192x192 is 2x Retina!
$iconSrc = "d:\Project\image-utils\src\assets\Orange Pixel Landscape Icon.png"
Optimize-PngImage -InputPath $iconSrc -OutputPath $iconSrc -TargetWidth 192 -TargetHeight 192

# 2. Optimize public/logo.png
# For social share preview and logo box, 512x512 is high resolution and super lightweight
$logoSrc = "d:\Project\image-utils\public\logo.png"
Optimize-PngImage -InputPath $logoSrc -OutputPath $logoSrc -TargetWidth 512 -TargetHeight 512

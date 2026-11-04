Add-Type -AssemblyName System.Drawing

$srcPath = 'c:\Users\shaik\Downloads\GDG Learn with communities\Frontend\public\necn-cloud-champions-banner.jpg'
$destDir = 'c:\Users\shaik\Downloads\GDG Learn with communities\Frontend\public\banner-assets'
if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir | Out-Null }

$src = [System.Drawing.Bitmap]::new($srcPath)
Write-Output ("Source banner size: " + $src.Width + "x" + $src.Height)

function Crop-Image($x, $y, $w, $h, $filename) {
    $rect = [System.Drawing.Rectangle]::new($x, $y, $w, $h)
    $crop = $src.Clone($rect, $src.PixelFormat)
    $crop.Save((Join-Path $destDir $filename), [System.Drawing.Imaging.ImageFormat]::Png)
    $crop.Dispose()
    Write-Output ("Saved " + $filename + ": " + $w + "x" + $h)
}

# 1. Narayana Engineering College Building (Center bottom)
Crop-Image 335 220 345 115 'college-building.png'

# 2. 3D Cloud and floating cubes (Left side)
Crop-Image 25 45 200 185 'cloud-3d-cubes.png'

# 3. Swags showcase: bottle, t-shirt, bag (Right side)
Crop-Image 725 65 190 190 'swags-showcase.png'

# 4. Learning path notepad (Bottom right)
Crop-Image 670 205 155 130 'notepad-path.png'

# 5. Narayana College Logo / Crest (Top center)
Crop-Image 380 15 210 40 'necn-college-crest.png'

$src.Dispose()
Write-Output 'Cropping complete!'


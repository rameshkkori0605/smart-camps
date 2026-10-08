# PowerShell script to check for any files >= 10MB
$maxBytes = 10MB

Write-Host "Scanning workspace for files larger than 10MB..." -ForegroundColor Cyan

$allFiles = Get-ChildItem -Path . -Recurse -File | Where-Object { $_.FullName -notmatch '\\\.git\\' }
$oversized = $allFiles | Where-Object { $_.Length -ge $maxBytes }

if ($allFiles.Count -eq 0) {
    Write-Host "No files found in workspace." -ForegroundColor Yellow
} else {
    Write-Host "Total files scanned: $($allFiles.Count)" -ForegroundColor Green
    
    if ($oversized) {
        Write-Host "WARNING: Found $($oversized.Count) file(s) exceeding 10MB limit:" -ForegroundColor Red
        foreach ($f in $oversized) {
            $sizeMB = [math]::Round($f.Length / 1MB, 2)
            Write-Host " - $($f.FullName.Replace((Get-Location).Path + '\', '')) : ${sizeMB} MB" -ForegroundColor Red
        }
        exit 1
    } else {
        Write-Host "All files are strictly under 10MB! Safe to deploy to GitHub." -ForegroundColor Green
        $largest = $allFiles | Sort-Object Length -Descending | Select-Object -First 1
        if ($largest) {
            $largestMB = [math]::Round($largest.Length / 1MB, 2)
            Write-Host "Largest file: $($largest.Name) (${largestMB} MB)" -ForegroundColor Cyan
        }
    }
}

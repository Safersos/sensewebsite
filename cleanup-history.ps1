# Git History Cleanup Script
# This will help clean up commits with exposed API keys

Write-Host "🔧 Git History Cleanup Script" -ForegroundColor Cyan
Write-Host ""
Write-Host "This will use interactive rebase to remove API keys from old commits."
Write-Host "⚠️  This will rewrite git history - make sure you're the only one working on this branch!"
Write-Host ""

$confirm = Read-Host "Continue? (y/n)"
if ($confirm -ne "y") {
    Write-Host "Cancelled." -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "Starting interactive rebase..." -ForegroundColor Green
Write-Host "You'll need to edit the commits manually in the editor that opens."
Write-Host ""

# Start interactive rebase from before the first problematic commit
git rebase -i 5fb3b92^1

Write-Host ""
Write-Host "✅ Rebase complete!" -ForegroundColor Green
Write-Host ""
Write-Host "If the rebase was successful, you can now push with:" -ForegroundColor Cyan
Write-Host "  git push origin main --force" -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  WARNING: Force push rewrites history. Only do this if you're sure!" -ForegroundColor Red


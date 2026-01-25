param (
    [Parameter(Mandatory=$true)]
    [string]$ProjectName,

    [Parameter(Mandatory=$true)]
    [string]$ProjectMission
)

$currentDir = Get-Location
$templateDir = "c:\Users\svenb\projects\general_template"
$targetDir = Join-Path $currentDir $ProjectName

if (Test-Path $targetDir) {
    Write-Error "Target directory '$targetDir' already exists."
    return
}

Write-Host "Creating new project: $ProjectName..."
Copy-Item -Path $templateDir -Destination $targetDir -Recurse -Exclude "init_project.ps1"

# Replace placeholders
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$filesToReplace = Get-ChildItem -Path $targetDir -Recurse -Include "*.md", "*.txt", "*.json"

foreach ($file in $filesToReplace) {
    $content = Get-Content -Path $file.FullName -Raw
    $content = $content -replace "{{PROJECT_NAME}}", $ProjectName
    $content = $content -replace "{{PROJECT_MISSION}}", $ProjectMission
    $content = $content -replace "{{TIMESTAMP}}", $timestamp
    Set-Content -Path $file.FullName -Value $content
}

# Initialize Git
Set-Location $targetDir
git init
git add .
git commit -m "chore: initial commit from general_template"

Write-Host "`nProject '$ProjectName' initialized at: $targetDir"
Write-Host "AI ASSISTANT: Start by reading '$ProjectName/PROJECT_HUB.md'."

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$htmlFiles = Get-ChildItem -LiteralPath $repoRoot -Filter *.html -Recurse
$errors = [System.Collections.Generic.List[string]]::new()

$forbidden = @(
  "Nine decision products",
  "9 decision products",
  "Four review-ready dashboards",
  "4 complete dashboards",
  "Four Power BI",
  "16 dashboard pages",
  "FMVA WORKBOOK",
  "NO ACTIVE"
)

foreach ($file in $htmlFiles) {
  $content = Get-Content -Raw -LiteralPath $file.FullName
  foreach ($literal in $forbidden) {
    if ($content.Contains($literal)) {
      $relative = [IO.Path]::GetRelativePath($repoRoot, $file.FullName)
      $errors.Add("$relative still contains '$literal'")
    }
  }
}

$requiredRoutes = @(
  "cases/fpa-operating-plan/index.html",
  "cases/finance-data-pipeline/index.html",
  "cases/fpt-valuation/index.html",
  "cases/working-capital-cash/index.html",
  "cases/capex-investment-committee/index.html",
  "power-bi/cases/sales-performance/index.html",
  "power-bi/cases/marketing-performance/index.html",
  "power-bi/cases/finance-performance/index.html",
  "power-bi/cases/credit-risk-performance/index.html",
  "power-bi/cases/sports-health-performance/index.html"
)

foreach ($route in $requiredRoutes) {
  if (-not (Test-Path -LiteralPath (Join-Path $repoRoot $route))) {
    $errors.Add("Missing route: $route")
  }
}

if ($errors.Count -gt 0) {
  $errors | ForEach-Object { Write-Error $_ }
  exit 1
}

Write-Host "Portfolio consistency checks passed: 10 cases and 17 Power BI pages."

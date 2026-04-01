# Script: Configure-EntraAppPermissions.ps1
# Konfiguruje uprawnienia aplikacji dla system-managed identity

param(
    [string]$AppName = "konta-zhp-backend",
    [string]$ResourceGroupName = "zhp-accounts"
)

$successColor = "Green"
$errorColor = "Red"
$infoColor = "Cyan"

function Write-Success($message) {
    Write-Host "[OK] $message" -ForegroundColor $successColor
}

function Write-Error-Custom($message) {
    Write-Host "[ERR] $message" -ForegroundColor $errorColor
}

function Write-Info($message) {
    Write-Host "[INFO] $message" -ForegroundColor $infoColor
}

# 0. Pobierz Subscription ID
Write-Info "Pobieram Subscription ID..."
$subscriptionId = az account show --query id -o tsv
if (-not $subscriptionId) {
    Write-Error-Custom "Nie udało się pobrać Subscription ID. Upewnij się, że jesteś zalogowany w az cli."
    exit 1
}
Write-Success "Subscription ID: $subscriptionId"

# 1. Znajdź aplikację (service principal)
Write-Info "Szukam aplikacji: $AppName"
$apps = az ad sp list --display-name $AppName | ConvertFrom-Json

if ($apps.Count -eq 0) {
    Write-Error-Custom "Nie znaleziono aplikacji: $AppName"
    exit 1
}

# Zloz pelny alternativeName i filtruj lokalnie po dokladnym dopasowaniu
$expectedAlternativeName = "/subscriptions/$subscriptionId/resourcegroups/$ResourceGroupName/providers/Microsoft.App/containerApps/$AppName"
$app = $apps | Where-Object { $_.alternativeNames -contains $expectedAlternativeName } | Select-Object -First 1

if (-not $app) {
    Write-Error-Custom "Nie znaleziono aplikacji z expected alternativeName: $expectedAlternativeName"
    exit 1
}

$appId = $app.appId
$objId = $app.id
$resourceId = $app.alternativeNames[1]

Write-Success "Znaleziono aplikację"
Write-Host "  - Display Name: $($app.displayName)"
Write-Host "  - App ID: $appId"
Write-Host "  - Object ID: $objId"
Write-Host "  - Resource ID: $resourceId"

# 2. Pobierz Microsoft Graph service principal
Write-Info "Szukam Microsoft Graph service principal..."
$graphSpn = "https://graph.microsoft.com"
$graphSpList = az ad sp list --spn $graphSpn | ConvertFrom-Json
$graphSp = $graphSpList | Select-Object -First 1

if (-not $graphSp) {
    Write-Error-Custom "Nie znaleziono Microsoft Graph service principal"
    exit 1
}

Write-Success "Znaleziono Microsoft Graph"
Write-Host "  - ID: $($graphSp.id)"

# 3. Uprawnienia, które chcemy przydzielić (AppRoles)
$requiredRoles = @(
    "User.ReadWrite.All",
    "UserAuthenticationMethod.ReadWrite.All",
    "RoleManagement.Read.Directory"
)

Write-Info "Szukam wymaganych App Roles..."
$graphAppRoles = $graphSp.appRoles

$rolesToGrant = @()
foreach ($roleName in $requiredRoles) {
    $role = $graphAppRoles | Where-Object { $_.value -eq $roleName -and $_.allowedMemberTypes -contains "Application" }
    if ($role) {
        Write-Success "Znaleziono role: $roleName (ID: $($role.id))"
        $rolesToGrant += $role
    } else {
        Write-Error-Custom "Nie znaleziono aplikacyjnej roli: $roleName"
    }
}

if ($rolesToGrant.Count -eq 0) {
    Write-Error-Custom "Brak znalezionych uprawnien do przydzielenia"
    exit 1
}

# 4. Przydziel uprawnienia (appRoleAssignment) dla managed identity service principal
Write-Info "Przydzielam uprawnienia aplikacji..."

$existingAssignments = az rest --method GET --uri "https://graph.microsoft.com/v1.0/servicePrincipals/$objId/appRoleAssignments" | ConvertFrom-Json
$existingRoleIds = @($existingAssignments.value | Where-Object { $_.resourceId -eq $graphSp.id } | Select-Object -ExpandProperty appRoleId)

foreach ($role in $rolesToGrant) {
    if ($existingRoleIds -contains $role.id) {
        Write-Info "  Uprawnienie juz istnieje: $($role.value)"
        continue
    }

    Write-Host "  - Przydzielam: $($role.value)..."
    $body = @{
        principalId = "$objId"
        resourceId  = "$($graphSp.id)"
        appRoleId   = "$($role.id)"
    } | ConvertTo-Json -Compress

    $tempPayloadFile = [System.IO.Path]::GetTempFileName()
    try {
        [System.IO.File]::WriteAllText($tempPayloadFile, $body, [System.Text.UTF8Encoding]::new($false))
        az rest --method POST --uri "https://graph.microsoft.com/v1.0/servicePrincipals/$objId/appRoleAssignments" --headers "Content-Type=application/json" "Accept=application/json" --body "@$tempPayloadFile" | Out-Null
    }
    finally {
        Remove-Item -Path $tempPayloadFile -Force -ErrorAction SilentlyContinue
    }

    Write-Success "  Przydzielono: $($role.value)"
}

Write-Success "Konfiguracja ukonczona"
Write-Info "System-managed identity jest gotowa do uzycia"
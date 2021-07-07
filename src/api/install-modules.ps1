Clear
#Get-ChildItem -Recurse -Directory | ForEach-Object {
Get-ChildItem -Directory | ForEach-Object {
    #New-Item -ItemType file -Path "$($_.FullName)" -Name "$($_.Name).txt"
    # Remove-Item -Path "$($_.FullName)/$($_.Name).txt"
    echo "Installing NodeJS modules for api $($_.FullName)"
    cd "$($_.FullName)"
    npm install
    cd ..
}
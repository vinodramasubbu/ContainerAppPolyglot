az containerapp delete --name movieorder1 --resource-group AzContainerAppRG

az containerapp create `
  --name movieorder1 `
  --resource-group AzContainerAppRG `
  --environment movieenv1 `
  --image xxxxxxxxxxxxxxxxx.azurecr.io/movieorder1:latest `
  --target-port 3603 `
  --ingress 'external' `
  --min-replicas 1 `
  --max-replicas 5 `
  --enable-dapr `
  --dapr-app-port 3603 `
  --dapr-app-id movieorder1 `
  --dapr-components ./components.yml `
  --registry-login-server 'xxxxxxxxxxxxxxxxx.azurecr.io' `
  --registry-username 'xxxxxxxxxxxxxxxxx' `
  --registry-password 'xxxxxxxxxxxxxxxxx'

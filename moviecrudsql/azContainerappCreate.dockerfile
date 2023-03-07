docker build -t moviecrudsql .
docker tag moviecrudsql:latest xxxxxxxxxxxxxxx.azurecr.io/moviecrudsql:latest
docker push xxxxxxxxxxxxxxx.azurecr.io/moviecrudsql:latest 

docker build -t moviecrudsql .
docker tag moviecrudsql:latest aksclustregistry1.azurecr.io/moviecrudsql:latest
docker push aksclustregistry1.azurecr.io/moviecrudsql:latest


az containerapp delete --name moviecrudsql --resource-group ContainerAppRG

az containerapp create `
  --name moviecrudsql `
  --resource-group ContainerAppRG `
  --environment movieuseastenv `
  --image xxxxxxxxxxxxxxx.azurecr.io/moviecrudsql:latest `
  --cpu 0.25 `
  --memory 0.5Gi `
  --target-port 3602 `
  --ingress 'external' `
  --min-replicas 1 `
  --max-replicas 5 `
  --enable-dapr `
  --dapr-app-port 3602 `
  --dapr-app-id moviecrudsql `
  --registry-login-server 'xxxxxxxxxxxxxxx.azurecr.io' `
  --registry-username 'xxxxxxxxxxxxxxx' `
  --registry-password 'xxxxxxxxxxxxxxx'

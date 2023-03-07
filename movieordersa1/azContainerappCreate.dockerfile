az containerapp delete --name movieorder2 --resource-group AzContainerAppRG

az containerapp create `
  --name movieorder2 `
  --resource-group AzContainerAppRG `
  --environment movieenv1 `
  --image xxxxxxxxxxxxxxx.azurecr.io/movieorder2:latest `
  --target-port 3604 `
  --ingress 'external' `
  --min-replicas 1 `
  --max-replicas 5 `
  --enable-dapr `
  --dapr-app-port 3604 `
  --dapr-app-id movieorder2 `
  --dapr-components ./components.yml `
  --registry-login-server 'xxxxxxxxxxxxxxx.azurecr.io' `
  --registry-username 'xxxxxxxxxxxxxxx' `
  --registry-password 'xxxxxxxxxxxxxxx'

docker build -t movieordersa .
docker tag movieordersa:latest xxxxxxxxxxxxxxx.azurecr.io/movieordersa:latest
docker push xxxxxxxxxxxxxxx.azurecr.io/movieordersa:latest 

docker build -t movieordersa .
docker tag movieordersa:latest xxxxxxxxxxxxxxx.azurecr.io/movieordersa:latest
docker push xxxxxxxxxxxxxxx.azurecr.io/movieordersa:latest


az containerapp create `
--name movieordersaapp `
--resource-group ContainerAppRG `
--environment moviesenv `
--image xxxxxxxxxxxxxxx.azurecr.io/movieordersa:latest `
--cpu 0.25 `
--memory 0.5Gi `
--target-port 3605 `
--ingress 'external' `
--min-replicas 1 `
--max-replicas 5 `
--enable-dapr `
--dapr-app-port 3605 `
--dapr-app-id movieordersa `
--dapr-components ./components.yml `
--registry-login-server 'xxxxxxxxxxxxxxx.azurecr.io' `
--registry-username 'xxxxxxxxxxxxxxx' `
--registry-password 'xxxxxxxxxxxxxxx'

az containerapp delete --name movieordersa --resource-group ContainerAppRG
az containerapp create `
--name movieordersa `
--resource-group ContainerAppRG `
--environment movieuseastenv `
--image xxxxxxxxxxxxxxx.azurecr.io/movieordersa:latest `
--cpu 0.5 `
--memory 1Gi `
--target-port 3605 `
--ingress 'external' `
--min-replicas 1 `
--max-replicas 5 `
--enable-dapr `
--dapr-app-port 3605 `
--dapr-app-id movieordersa `
--dapr-components ./components.yml `
--registry-login-server 'xxxxxxxxxxxxxxx.azurecr.io' `
--registry-username 'xxxxxxxxxxxxxxx' `
--registry-password 'xxxxxxxxxxxxxxx'

docker build -t movieordersa:r2 .
docker tag movieordersa:r2 xxxxxxxxxxxxxxx.azurecr.io/movieordersa:r2
docker push xxxxxxxxxxxxxxx.azurecr.io/movieordersa:r2 

az containerapp update `
--name movieordersa `
--resource-group ContainerAppRG `
--environment movieuseastenv `
--image xxxxxxxxxxxxxxx.azurecr.io/movieordersa:r2 `
--cpu 0.5 `
--memory 1Gi `
--target-port 3605 `
--ingress 'external' `
--min-replicas 1 `
--max-replicas 3 `
--enable-dapr `
--dapr-app-port 3605 `
--dapr-app-id movieordersa `
--dapr-components ./components.yml `
--registry-login-server 'xxxxxxxxxxxxxxx.azurecr.io' `
--registry-username 'xxxxxxxxxxxxxxx' `
--registry-password 'xxxxxxxxxxxxxxx' `
--environment-variables WELCOME='revision2'

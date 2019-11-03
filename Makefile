deploy:
	docker-compose -f docker-compose.yaml down --remove-orphans
	docker-compose -f docker-compose.yaml up -d --build
	docker-compose -f docker-compose.yaml ps

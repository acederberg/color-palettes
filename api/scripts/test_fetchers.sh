# Do not use 'npm run start'. Its power/compute usage is high and its time to start is large.
clear \
	&& docker compose --file ./docker-compose.yaml up --detach --build \
	&& docker exec api bash -c "npm run build" \
	&& docker exec --detach api bash -c "node ./dist/src/entrypoint.js" \
	&& echo "Waiting $FETCHERS_AWAIT_API_TIME seconds for api service..." \
	&& echo "To reduce wait time set 'FETCHERS_AWAIT_API_TIME' to the desired waiting time in seconds." \
	&& sleep $FETCHERS_AWAIT_API_TIME \
	&& clear \
	&& docker exec api bash -c "npm run test-fetchers-no-service" \

# Save the exit code of the above
SUCCESS=$?

docker exec api bash -c "pgrep -f 'npm run start' | xargs kill" \
	&& docker compose --file ./docker-compose.yaml down

exit $SUCCESS

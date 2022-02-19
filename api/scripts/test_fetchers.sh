#!/bin/bash

# FETCHERS_TESTS_LOOP -- To loop or not to loop?
# FETCHERS_AWAIT_API_TIME -- How long to wait for the api to turn on.
# LAZY -- Avoid unnecessary steps.


# SETUP ----------------------------------------------------------------------

# Decide which script to run based off of the $FETCHERS_TESTS_LOOP variable
npm_script_prefix=$( if ( test $FETCHERS_TESTS_LOOP -eq 1 ); then echo "start-" ; fi  )
npm_script="npm run ${npm_script_prefix}test-fetchers-no-service" 

# If $LAZY
# Do not use 'npm run start'. Its power/compute usage is high and its time to start is large.
if ( test $LAZY ); then
	echo -e "ENVIRONMENT:\n\tFETCHERS_TESTS_LOOP=${FETCHERS_TESTS_LOOP}\n\tFETCHERS_AWAIT_API=${FETCHERS_AWAIT_API_TIME}\n\tLAZY=${LAZY}"
	echo "WARNING: Not building ./src and assuming the docker containers are alread started."
else clear \
	&& docker compose --file ./docker-compose.yaml up --detach --build \
	&& docker exec api bash -c "npm run build" 
fi


# If build failed, do not do anything else.
if ( test $? -ne 0 ); then exit $_ ; fi



# ACTUAL TESTS ------------------------------------------------------------ 

# Start the api, wait $FETCHERS_AWAIT_API_TIME seconds, and final execute $npm_script
docker exec --detach api bash -c "node ./dist/src/entrypoint.js" \
	&& echo "Waiting $FETCHERS_AWAIT_API_TIME seconds for api service..." \
	&& sleep 1 \
	&& echo "To reduce wait time set 'FETCHERS_AWAIT_API_TIME' to the desired waiting time in seconds." \
	&& sleep $FETCHERS_AWAIT_API_TIME \
	&& clear \
	&& echo "Running $npm_script..." \
	&& docker exec api bash -c "$npm_script"

# Save the exit code of the above
SUCCESS=$?



# TEARDOWN -----------------------------------------------------------------

# Kill the proccesses in the container
docker exec api bash -c "pgrep -f 'npm run start' | xargs kill" 

# If lazy, the do not kill containers
if ( test $LAZY ); then
	echo "\n\nSkipping teardown."
else
	docker compose --file ./docker-compose.yaml down
fi


exit $SUCCESS

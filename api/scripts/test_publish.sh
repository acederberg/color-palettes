#!/bin/bash
# Warning: This assumes that 1) Version is on its own row, 2) that it looks like '"version": "myVersion","
version=$( cut -d '"' -f 4 <<< $( cat package.json | grep '^ *"version.*"[0-9]*.[0-9]*.[0-9]*",.*' ) )
pack_name="palletes-fetchers-$version"
temp="pack_tests"
test -d $temp || mkdir $temp

npm pack >> /dev/null \
	&& tar -xzvf ./$pack_name.tgz -C $temp >> /dev/null


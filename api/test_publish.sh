#!/bin/bash
pack_name="palletes-fetchers-1.0.10"
temp=pack_tests
test -d $temp || mkdir $temp
npm pack
echo -e "\n====================================================\n"
tar -xzvf ./$pack_name.tgz -C $temp
echo


#!/bin/sh
cd /home/user/malik-
until grep -q "REPRISE2 bacon FIN" travail_voix.log; do sleep 20; done
kill -CONT 13294

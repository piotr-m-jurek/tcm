#!/bin/bash

DB="tcm.db"
BACKUP="backup"

TABLES='action flavor food route temperature type food-actions food-flavors food-routes'

# Loop through tables and export each as a CSV
for TABLE in $TABLES; do
    sqlite3 -header -csv $DB "SELECT * FROM '$TABLE';" > "${BACKUP}/${TABLE}.csv"
    echo "Exported $TABLE to ${TABLE}.csv"
done

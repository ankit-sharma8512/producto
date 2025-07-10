SAVEPOINT_LOCATION=/tmp/flink/state/state_sp
FLINK_JOB_NAME="Stock Processor"
JOB_MANAGER_URL="http://localhost:8081"
PY_FILES="stock-update/kafka_source.py,stock-update/route.py,stock-update/parsers.py,stock-update/processors.py,stock-update/sinks.py,stock-update/validate.py"
PYTHON_MAIN="stock-update/main.py"

last_savepoint_path=$(find "$SAVEPOINT_LOCATION" -maxdepth 1 -type d -name "savepoint-*" | sort | tail -n 1)

trigger_savepoint() {
  JOB_ID=$(flink list -r | grep "$FLINK_JOB_NAME" | awk '{print $4}')
  if [ -z "$JOB_ID" ]; then
    echo "$(date): No running Flink job found, skipping savepoint"
    return
  fi

  echo "$(date): Triggering savepoint for job $JOB_ID..."

  SAVEPOINT_OUTPUT=$(flink savepoint -m localhost:8081 $JOB_ID file://$SAVEPOINT_LOCATION 2>&1)

  if echo "$SAVEPOINT_OUTPUT" | grep -q 'Savepoint completed'; then
    echo "$(date): Savepoint triggered successfully"
    # Extract the savepoint path from output
    NEW_SAVEPOINT_PATH=$(echo "$SAVEPOINT_OUTPUT" | grep -oP '(?<=Savepoint completed. Path: )\S+' | sed 's|^file:||')
    echo "$(date): New savepoint path: $NEW_SAVEPOINT_PATH"

    # Delete the previous savepoint directory if exists and different
    if [ -n "$last_savepoint_path" ] && [ "$last_savepoint_path" != "$NEW_SAVEPOINT_PATH" ]; then
      echo "$(date): Deleting previous savepoint at $last_savepoint_path"
      rm -rf "$last_savepoint_path"
    fi

    last_savepoint_path="$NEW_SAVEPOINT_PATH"
    return 0
  else
    echo "$(date): Savepoint failed or incomplete:"
    echo "$SAVEPOINT_OUTPUT"
    return 1
  fi
}

start_flink_job() {
    LATEST_SAVEPOINT=$(find "$SAVEPOINT_LOCATION" -maxdepth 1 -type d -name "savepoint-*" | sort | tail -n 1)

    if [ -n "$LATEST_SAVEPOINT" ]; then
    echo "$(date): Savepoint found at $LATEST_SAVEPOINT. Restoring from savepoint..."
    flink run \
        -s "$LATEST_SAVEPOINT" \
        -pyFiles $PY_FILES \
        --python $PYTHON_MAIN -d
    else
    echo "$(date): No savepoint found at $SAVEPOINT_LOCATION. Starting job fresh..."
    flink run \
        -pyFiles $PY_FILES \
        --python $PYTHON_MAIN -d
    fi
}

start_flink_job

(
  while true; do
    trigger_savepoint >> savepoint.log 2>&1
    sleep 120
  done
) &
echo $! > savepoint.pid

echo "Flink job and periodic savepoint triggering started in background."
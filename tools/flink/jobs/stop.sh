FLINK_JOB_NAME="Stock Processor"
JOB_ID=$(flink list -r | grep "$FLINK_JOB_NAME" | awk '{print $4}')
flink cancel $JOB_ID
# echo $JOB_ID

kill $(cat savepoint.pid)
wait $(cat savepoint.pid)
rm savepoint.pid
#!/usr/bin/env bash
LOG=/shared/logs/matlab_experiment.log
PID=/tmp/matlab.pid
nohup matlab -batch experiment_run.m >>"$LOG" 2>&1 &
echo $! > "$PID"

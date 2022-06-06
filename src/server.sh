pgrep -f python3 | sudo xargs kill
nohup python3 run.py > ../log/out_`date "+%Y%m%d%H%M"`.log 2> ../log/error_`date "+%Y%m%d%H%M"`.log &

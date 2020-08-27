while getopts ":h:" opt; do
  case $opt in
    h)
      echo "-h was triggered, Parameter: $OPTARG"
      var="var server = 'http://$OPTARG:5000/';"
      sed -i "1c$var" ./front/src/components/API.js
      docker-compose build
      docker-compose up
      ;;
    \?) 
      echo "Usage: ./run.sh -h {HOST_IP}"
      echo "Ex.: ./run.sh -h 0.0.0.0" >&2
      exit 1
      ;;
    :)
      echo "Option -$OPTARG requires an argument." >&2
      exit 1
      ;;
  esac
done

if ((OPTIND == 1))
then
    echo "Usage: ./run.sh -h {HOST_IP}"
    echo "Ex.: ./run.sh -h 0.0.0.0"
fi
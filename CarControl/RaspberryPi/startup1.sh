#/bin/sh
echo ""
echo ""
echo ""
echo "Created by Austin Wilson (16)"
echo ""
echo ""
sudo wget -q --tries=10 --timeout=20 --spider http://google.com

if [ $? -eq 0 ]; then
	sudo python pubnubControlTest.py
else
	echo "Please connect to the internet, then reboot."
fi

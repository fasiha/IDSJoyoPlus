all: ids.html ids.txt tree/ index.html

ansi2html.sh:
	wget https://raw.githubusercontent.com/pixelb/scripts/master/scripts/ansi2html.sh

ids.html: ansi2html.sh
	echo 'for i in `cat joyoplus.txt `;do idsgrep -dc -C $$i;done' > idsjoyoplus.sh
	chmod 755 idsjoyoplus.sh

	script -q ids.out ./idsjoyoplus.sh | ansi2html.sh --bg=dark --palette=linux > ids.html

	sed -i.bak -e 's/【\(.\)】/【<a href="tree\/\1.txt" style="color:inherit; text-decoration:none;">\1<\/a>】/' ids.html
	rm ids.html.bak

index.html: ids.html
	cp ids.html index.html

ids.txt:
	for i in `cat joyoplus.txt `;do idsgrep -dc $$i; done > ids.txt

tree/:
	mkdir -p tree
	for i in `cat joyoplus.txt `;do idsgrep -dc -c indent $$i > tree/$$i.txt; done

clean:
	rm -fr tree ids.html ids.txt ids.out idsjoyoplus.sh index.html
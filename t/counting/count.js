var pcap = require('pcap'),
    pcap_session = pcap.createSession(en0);

counter = 0;
pcap_session.on('packet', function (raw_packet) {
	counter=counter+1;
});
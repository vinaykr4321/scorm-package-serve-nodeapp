var coursename = readTextFile("coursename.txt"); var companyname = readTextFile("companyname.txt"); function readTextFile(file){ var rawFile = new XMLHttpRequest(); rawFile.open("GET", file, false); rawFile.send(null); return rawFile.responseText; } var sp = sp || []; sp.load=function(e,o){sp._endpoint = e; if (o) { sp.init(o) }; var t = document.createElement("script"); t.type = "text/javascript", t.async = !0, t.src = "https://lms.atsmedia.com/report/scorm_track/webTrack.js"; var n = document.getElementsByTagName("script")[0]; n.parentNode.insertBefore(t, n)}; sp.load("https://lms.atsmedia.com");
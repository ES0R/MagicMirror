/* Config Sample
 *
 * For more information on how you can configure this file
 * see https://docs.magicmirror.builders/configuration/introduction.html
 * and https://docs.magicmirror.builders/modules/configuration.html
 *
 * You can use environment variables using a `config.js.template` file instead of `config.js`
 * which will be converted to `config.js` while starting. For more information
 * see https://docs.magicmirror.builders/configuration/introduction.html#enviromnent-variables
 */
let config = {
	address: "0.0.0.0",	// Address to listen on, can be:
							// - "localhost", "127.0.0.1", "::1" to listen on loopback interface
							// - another specific IPv4/6 to listen on a specific interface
							// - "0.0.0.0", "::" to listen on any interface
							// Default, when address config is left out or empty, is "localhost"
	port: 8080,
	basePath: "/",	// The URL path where MagicMirror² is hosted. If you are using a Reverse proxy
	
	// you must set the sub path here. basePath must end with a /
	ipWhitelist: [], // Temporarily allow all devices for testing
    //ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1", "172.18.0.0/20", "192.168.1.0/24"], // Allow local access and both network ranges
									// or add a specific IPv4 of 192.168.1.5 :
									// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.1.5"],
									// or IPv4 range of 192.168.3.0 --> 192.168.3.15 use CIDR format :
									// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.3.0/28"],

	useHttps: false,			// Support HTTPS or not, default "false" will use HTTP
	httpsPrivateKey: "",	// HTTPS private key path, only require when useHttps is true
	httpsCertificate: "",	// HTTPS Certificate path, only require when useHttps is true

	language: "da",
	locale: "da-DK",   // this variable is provided as a consistent location
			   // it is currently only used by 3rd party modules. no MagicMirror code uses this value
			   // as we have no usage, we  have no constraints on what this field holds
			   // see https://en.wikipedia.org/wiki/Locale_(computer_software) for the possibilities

	logLevel: ["INFO", "LOG", "WARN", "ERROR"], // Add "DEBUG" for even more logging
	timeFormat: 24,
	units: "metric",

	modules: [
		{
			module: "alert",
		},
		{
			module: "updatenotification",
			position: "top_bar"
		},
		{
			module: "clock",
			position: "top_left"
		},
		{
			module: "calendar",
			header: "Mad Kalender",
			position: "top_left",
			config: {
				colored: true,
				tableClass: "small",
				maximumEntries: 8,
				maximumNumberOfDays: 30,
				fade: true,
				fadePoint: 0.3,
				calendars: [
					{
						symbol: "utensils",
						url: "https://calendar.google.com/calendar/ical/0d3515a0577c06df61a9c264fa597255b7268648684370cfb770618d7f8681c9%40group.calendar.google.com/private-8a24382b7bd974168e494e7189afb890/basic.ics",
						color: "#FF6347"
					}
				]
			}
		},
		{
			module: "MMM-CalendarExt3Journal",
			position: "bottom_right",
			config: {
				instanceId: "journal",
				locale: "da-DK",
				calendarSet: ["Tasks", "Personal", "Buffer", "couple", "Projects", "social", "holiday", "Work", "workout"],
				staticTime: true,
				beginHour: 6,
				hourLength: 17,
				width: "300px",
				height: "1000px",
				eventFilter: (ev) => {
					// Filter out Tasks calendar from journal view
					if (ev.calendarName === 'Tasks') return false;
					return true;
				}
			}
		},
		{
			module: "calendar",
			header: "Today's Tasks",
			position: "top_left",
			config: {
				colored: false,
				tableClass: "small",
				maximumEntries: 25,
				maximumNumberOfDays: 2,
				getRelative: -1,
				fade: false,
				broadcastPastEvents: true,
				calendars: [
					{
						symbol: "tasks",
						url: "https://calendar.google.com/calendar/ical/emiloramovic%40gmail.com/private-3e0333746d580633a5850ffa7cea7371/basic.ics",
						color: "#FFD700",
						fetchInterval: 60000
					}
				]
			}
		},
		{
			module: "calendar",
			header: "Events",
			position: "top_right",
			config: {
				colored: true,
				tableClass: "small",
				maximumEntries: 10,
				maximumNumberOfDays: 30,
				fade: true,
				fadePoint: 0.3,
				calendars: [
					{
						symbol: "calendar",
						url: "https://calendar.google.com/calendar/ical/75b415976d2dc5e3535748f459014ef64bf11efe61cf7f2438978e5197488e0c%40group.calendar.google.com/private-323e1913dddbbe7939ffda133d8a605a/basic.ics",
						color: "#00CED1"
					}
				]
			}
		},
		{
			module: "calendar",
			position: "bottom_bar",
			classes: "hidden-calendar",
			config: {
				broadcastPastEvents: true,
				calendars: [
					{
						name: "Tasks",
						url: "https://calendar.google.com/calendar/ical/emiloramovic%40gmail.com/private-3e0333746d580633a5850ffa7cea7371/basic.ics",
						color: "#FFD700"
					},
					{
						name: "Personal",
						url: "https://calendar.google.com/calendar/ical/c62acfd76f2e331620fac3e2b7da16466c7e0f5ce56d7d60835ee4f595c9e526%40group.calendar.google.com/private-50273ca55676b3a26a5ba1933d153e3a/basic.ics",
						color: "#32CD32"
					},
					{
						name: "Buffer",
						url: "https://calendar.google.com/calendar/ical/36ca1582ab365cd11661878c1da0b20beedb3091afb8fc5ed00bcd981ad62f81%40group.calendar.google.com/private-ae4ca5942beacb563dceeba67936a14f/basic.ics",
						color: "#5a5a5aff"
					},
					{
						name: "couple",
						url: "https://calendar.google.com/calendar/ical/740061f28a7ebf6130265eec1cfad4ddf9679b9e2ac24d0bf06b6c6d8340a5a3%40group.calendar.google.com/private-6ea53443903363eb71eaa8ff475ad160/basic.ics",
						color: "#ff69a8ff"
					},
					{
						name: "Projects",
						url: "https://calendar.google.com/calendar/ical/7a6ea1b4353aab5199095c2352203c4ad5fb862d2758cb3277b41760a28cb74b%40group.calendar.google.com/private-d8fefa4de25ecd5422aa8835803b4485/basic.ics",
						color: "#d4db70ff"
					},
					{
						name: "holiday",
						url: "https://calendar.google.com/calendar/ical/7a6ea1b4353aab5199095c2352203c4ad5fb862d2758cb3277b41760a28cb74b%40group.calendar.google.com/private-f43b0ea11626e3f0557097114e02c6bc/basic.ics",
						color: "#ff0000ff"
					},
					{
						name: "social",
						url: "https://calendar.google.com/calendar/ical/3d59b442abdc9c1712cabd4ac0cf4ff38408f341a6855fd1b0d379e0d9148b5f%40group.calendar.google.com/private-c78d459d291e70792f87fda5cdc9b8fe/basic.ics",
						color: "#00fff7ff"
					},
					{
						name: "Work",
						url: "https://calendar.google.com/calendar/ical/8ccac9000624ed5f2363b7c79fde5d72edffa347954737e01e707d1c5d597c01%40group.calendar.google.com/private-0612b45a9c74fdb577652dc6e7e5a8f1/basic.ics",
						color: "#ff9100ff"
					},
					{
						name: "workout",
						url: "https://calendar.google.com/calendar/ical/a2f816c765010148264bc0523e624c83d21cdab1ef6ebb9f3d9b2cee22d174e4%40group.calendar.google.com/private-420184ab0fc0e61c09bf4a4c48a955cd/basic.ics",
						color: "#a314dcff"
					}
				]
			}
		},
		{
			module: "weather",
			position: "bottom_left",
			header: "Vejr i dag",
			config: {
				weatherProvider: "openmeteo",
				type: "hourly",
				lat: 55.6761,
				lon: 12.5683,
				maxEntries: 12,
				showPrecipitationAmount: true,
				colored: true,
				showFeelsLike: false
			}
		},
	]
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") { module.exports = config; }

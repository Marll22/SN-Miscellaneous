# MID Server Troubleshooting

## MID Server failed to start when it was installed as a daemon under Ubuntu 20.04/systemd

### Description

Starting the MID Serve failed on the linux server (Ubuntu 20.04/ systemd ) which the MID Server was already installed as a daemon under systemd

### Symptoms

After installing the MID Server as a daemon using "./bin/mid.sh install" if you try to restart the MID Server

if you run `./bin/mid.sh start` you face the following error `SYSTEMD_KILLMODE` is set to `process` on the top of the script, but the daemon is running with `KillMode=control-group`. The daemon must be reinstalled for the value of `SYSTEMD_KILLMODE` to take effect.

*Note: DO NOT change the `KillMode` to `control-group`. `Control-group` will cause the mid server upgrade failed. Keep the `KillMode` as `process`.*

if you run `./bin/mid.sh restart` or `systemctl start mid.service` we face the following error

> Failed to start mid.service: Unit mid.service failed to load properly: Invalid argument.See system logs and 'systemctl status mid.service' for details.

And if you run `systemctl status mid.service` we have the following info

```sh
mid.service - ServiceNow MID ServerLoaded: error (Reason: Unit mid.service failed to load properly: Invalid argument.)
     Active: inactive (dead)
Jan 12 22:06:10 u20-INC0032988-01 systemd[1]: Started ServiceNow MID Server.Jan 12 22:06:31 u20-INC0032988-01 systemd[1]: Stopping ServiceNow MID Server...Jan 12 22:06:31 u20-INC0032988-01 mid.sh[289922]: Stopping ServiceNow MID Server...Jan 12 22:06:34 u20-INC0032988-01 mid.sh[289922]: Stopped ServiceNow MID Server.Jan 12 22:06:34 u20-INC0032988-01 systemd[1]: mid.service: Succeeded.Jan 12 22:06:34 u20-INC0032988-01 systemd[1]: Stopped ServiceNow MID Server.Jan 12 22:06:59 u20-INC0032988-01 systemd[1]: /etc/systemd/system/mid.service:9: PIDFile= path is not normalize>Jan 12 22:07:56 u20-INC0032988-01 systemd[1]: /etc/systemd/system/mid.service:9: PIDFile= path is not normalize>Jan 12 22:28:08 u20-INC0032988-01 systemd[1]: /etc/systemd/system/mid.service:9: PIDFile= path is not normalize>Jan 12 22:30:07 u20-INC0032988-01 systemd[1]: /etc/systemd/system/mid.service:9: PIDFile= path is not normalize>
```

### Steps to reproduce

- Have a root access to a linux server (Ubuntu 20.04/ systemd )
- Download a new MID Server zip file and extract the agent folder
- Go to the agent folder
- Install the mid server as a daemon using `./bin/mid.sh install`
- Make sure that MID server is installed using `./bin.mid.sh start`.
- You see the `installed with systemd` in the status
- `ServiceNow MID Server (installed with systemd) is not running.`
- Try to start the MID Server using `./bin/mid.sh start` or `systemctl start mid.service`.
- It failed to start the MID Server

### Workaround

1. Make sure that your MID Server is installed as a daemon under systemd
2. Run `./bin/mid.sh status` and make sure that you have the message shows the MID Server is installed under `systemd`
3. Open the unit file of the service. This file is available in `/etc/systemd/system/YOUR_MIDSERVER_NAME.service`. For example, if your service name is mid then you need to edit `/etc/systemd/system/mid.service`
4. In the unit file edit `PIDFILE` from `PIDFile=/root/agent/bin/../work/mid.pid` to `PIDFile=/root/agent/work/mid.pid`
5. Run `systemctl daemon-reload` to reload the daemon with the edited `PIDFILE`
6. Start the MID Server using `systemctl start YOURMIDSERVER.service`

**Source**: Support knowledge article: [KB0870356](https://support.servicenow.com/kb?id=kb_article_view&sysparm_article=KB0870356&sysparm_rank=3&sysparm_tsqueryId=18c33ef3dba3e850190b1ea6689619ae)

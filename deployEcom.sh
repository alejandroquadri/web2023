
#!/bin/bash
lftp -u web@quadritile.com,EPQuadri384 ftp.quadritile.com <<EOF
set ssl:verify-certificate no
glob -a rm -r *
mirror -R /Users/ale/dev/quadri-web/dist/quadri-web/browser/ /
bye
EOF

# Let's break down what this script does:

# The #!/bin/bash at the start tells the system that this is a Bash script.

# lftp -u web@quadri.com.ar,GodoyCruz1304 ftp.quadri.com.ar logs into the FTP server at ftp.quadri.com.ar with the username web@quadri.com.ar and the password GodoyCruz1304.

# set ssl:verify-certificate no

# The error you're seeing typically indicates that the certificate provided by the FTP server doesn't match the server's hostname. This might happen if the server's SSL certificate is self-signed, out of date, or issued for a different domain name. In lftp, you can disable certificate verification for a particular session to bypass this error. However, you should be aware that disabling certificate verification can pose a security risk, because it makes it easier for others to intercept your data. You should only disable certificate verification if you trust the server and the network you're on.

# <<EOF starts a "here document", which allows us to enter multiple lines of input. Everything until the EOF line will be treated as input to the lftp command.

# glob -a rm -r * deletes all files and directories in root on the server.

# mirror -R /Users/ale/dev/quadri-web/dist/quadri-web/browser/ / uploads the contents of your local directory to the root directory on the server. The -R flag means it's a reverse mirror, i.e., uploading local files to the remote server.

# bye logs out from the FTP server.

# EOF ends the "here document".

# luedo de guardar este documento hay que correr este comando para convertirlo en ejecutable
# chmod +x /Users/ale/dev/quadri-web/deploy.sh
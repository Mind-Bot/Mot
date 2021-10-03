#!/bin/sh

# 记录行动
action=$1

# 发送help信息
function sendHelp() {
    cat <<EOF
This is a helper.
EOF
}

# 若指令为"./mot.sh"或"./mot.sh -h"
if [ $# == 0 ] || [ "${action}" == "-h" ]; then
    sendHelp
    exit
fi

dir="plugins"
branch="main"

# 确认存放插件的文件夹是否存在；不存在则新建文件夹
function checkDir() {
    if [[ ! -d ${dir} ]]; then
        mkdir ${dir}
    fi
}

function install() {
    checkDir

    ssh_test=$(ssh -T git@github.com 2>&1)
    if [ $? == 1 ] && [[ "${ssh_test}" =~ ^Hi.* ]]; then
        url="git@github.com:Mind-Bot"
        echo "Using SSH URL to download plugins (${url}/plugin-*.git)"
    else
        url="https://github.com/Mind-Bot"
        echo "Using HTTPS URL to download plugins (${url}/plugin-*.git)"
    fi

    for plugin in $@; do
        name="plugin-${plugin}"
        path="${dir}/${name}"
        echo "Install ${name}..."

        # error=`git clone -b ${branch} "${url}/${name}.git" "${dir}/${name}" 2>&1`
        error=$(git clone "${url}/${name}.git" "${path}" 2>&1)
        # if [ $? == 0 ] && [ ${#error} == 0 ]; then
        if [ $? == 0 ]; then
            yarn tsc -p ${path}/tsconfig.json
            echo "success ${name} installed."
        else
            echo "error Something failed. This is the error msg:"
            echo $error
            echo
        fi
    done

}

function build() {
    yarn
    yarn tsc
    if [[ -d ${dir} ]]; then
        for plugin in $(ls ${dir} 2>&1); do
            path="${dir}/${plugin}"
            yarn tsc -p ${path}/tsconfig.json
        done
    fi
}

function dev() {
    yarn tsc
    node ./dev.js
}

function pro() {
    yarn tsc
    node ./dist/index.js
}

case ${action} in
"install")
    install ${@:2}
    ;;

"build")
    build
    ;;

"dev")
    dev
    ;;

"pro")
    pro
    ;;

*)
    sendHelp
    ;;
esac

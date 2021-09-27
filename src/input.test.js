function parse(value) {
    const tagRegExp = /\B(\#[\wа-я]*\b)/g;
    const tagRegExp1 = /<span>\B(\#[\wа-я]*\b)<\/span>/g;
    const tagFromNewLineRegExp = /\B(<br>\#[\wа-я]*\b)/g;
    // const tagEndRegExp = /<span>\B(\#[\wа-я]+\b)(?!;)<\/span>/g;
    const newLineRegExp = /<div><span><br><\/span><\/div>/g;
    const separatorRegExp = /[\s]+/g;
    let html = [];

    const str = value.split(separatorRegExp);

    for (let i = 0; i < str.length; i++) {
        if (str[i].match(tagRegExp) && !str[i].includes('<span>')) {
            str[i] = str[i].replace(tagRegExp, `<span>${str[i].match(tagRegExp)}</span>`);
        }

        if (str[i].includes('<div>') && !str[i].includes('</div>')) {
            str[i] = str[i].replace('<div>', '<br>');
            str[i + 1] = str[i + 1].substring(0, str[i + 1].length - 6);
        }

        if (str[i].match(tagFromNewLineRegExp)) {
            str[i + 1] = str[i].match(tagFromNewLineRegExp)[0];
            str[i] = str[i].substring(0, str[i].length - 6);
        }

        str[i] = str[i].replace(newLineRegExp, '<br><br>'); // replace auto generated part after <br> tag

        if (tagRegExp.test(str[i]) && str[i].charAt(0) !== '<') { // divide into two items if # printed not after space
            str.splice(i + 1, 0, str[i].substring(str[i].indexOf('<span>')));
            str[i] = str[i].substring(0, str[i].indexOf('<span>'));
        }
        if (str[i].includes('<span>') && !str[i].match(tagRegExp1)) {
            let nonValidSymbolPos;
            for (let j = 7; j < str[i].length - 7; j++) {
                const curr = str[i].charAt(j);
                if (/[^\wа-я]+/g.test(curr)) {
                    nonValidSymbolPos = j;
                    break;
                }
            }
            str[i + 1] = str[i].slice(nonValidSymbolPos, str[i].length - 7);
            str[i] = str[i].substring(0, nonValidSymbolPos) + '</span>';
            html.push(str[i]);
            html.push(str[i + 1]);
            ++i;
        }
        else {
            html.push(str[i]);
        }
    }

    const tags = str.filter(i => i.match(tagRegExp))
        .map(i => i.substring(i.indexOf('<span>') + 6, i.indexOf('</span>')))
        .filter(i => i.length > 1);


    return tags;
}

it("parse", function() {
    expect(parse('#qweq, asdas#ads #asd <br>#asdasd < asdasd <br>asdasd asd#qqe #aa')).toStrictEqual(["#qweq", "#asd",
        "#asdasd", "#aa"])
});
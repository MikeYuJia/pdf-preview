function convertToDBKey(key) {
    return Buffer.from(key).toString('base64');
}

exports.convertToDBKey = convertToDBKey;
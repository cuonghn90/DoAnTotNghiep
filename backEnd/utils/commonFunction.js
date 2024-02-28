const autoGenerateCouponCode = (typeCoupon) => {
    // Tạo chuỗi ngẫu nhiên cho phần số xxxxx
    const randomDigits = Math.floor(Math.random() * 100000).toString().padStart(5, '0');

    // Tạo chuỗi theo định dạng DAV-ALL-xxxxx
    let randomString = `DAV-${typeCoupon}-${randomDigits}`;

    return randomString;
}

const padTo2Digits = (num) => {
    return num.toString().padStart(2, '0');
}

const formatDate = (oldDate) => {
    const date = new Date(oldDate)
    return (
        [
            date.getFullYear(),
            padTo2Digits(date.getMonth() + 1),
            padTo2Digits(date.getDate()),
        ].join('-') +
        ' ' +
        [
            padTo2Digits(date.getHours()),
            padTo2Digits(date.getMinutes()),
            padTo2Digits(date.getSeconds()),
        ].join(':')
    );
}

module.exports = { autoGenerateCouponCode, formatDate }
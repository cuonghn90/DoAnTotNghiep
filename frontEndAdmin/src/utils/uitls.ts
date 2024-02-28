import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { v4 as uuid } from "uuid";

export const getNameOfEmail = (email: string) => {
    const indexBeforeName = email.indexOf("@");
    const name = email.substring(0, indexBeforeName);
    return name;
};
export function padTo2Digits (num: number) {
    return num.toString().padStart(2, '0');
}

export function formatDateFullYear (oldDate: Date) {
    const date = new Date(oldDate);
    return (
        [
            date.getFullYear(),
            padTo2Digits(date.getMonth() + 1),
            padTo2Digits(date.getDate()),
        ].join('-') 
    );
}

export function formatDate (oldDate: Date) {
    const date = new Date(oldDate);
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


export function getDayMonthYear (oldDate: Date) {
    const date = new Date(oldDate);
    return (
        [
            date.getFullYear(),
            padTo2Digits(date.getMonth() + 1),
            padTo2Digits(date.getDate()),
        ].join('-')
    );
}


export function getHourMinuteSecond (oldDate: Date) {
    const date = new Date(oldDate);
    return (
        [
            padTo2Digits(date.getHours()),
            padTo2Digits(date.getMinutes()),
            padTo2Digits(date.getSeconds()),
        ].join(':')
    );
}

export function formatDateStart (oldDate: Date) {
    const date = new Date(oldDate);
    return (
        [
            date.getFullYear(),
            padTo2Digits(date.getMonth() + 1),
            padTo2Digits(date.getDate()),
        ].join('-') +
        ' ' +
        [
            padTo2Digits(0),
            padTo2Digits(0),
            padTo2Digits(0),
        ].join(':')
    );
}

export function formatDateEnd (oldDate: Date) {
    const date = new Date(oldDate);
    return (
        [
            date.getFullYear(),
            padTo2Digits(date.getMonth() + 1),
            padTo2Digits(date.getDate()),
        ].join('-') +
        ' ' +
        [
            padTo2Digits(23),
            padTo2Digits(59),
            padTo2Digits(59),
        ].join(':')
    );
}

export function getDayStart (date = new Date()) {
    const newDate = new Date(date.getTime());
    newDate.setDate(date.getDate());
    return formatDateStart(newDate);
}

export function getDayEnd (date = new Date()) {
    const newDate = new Date(date.getTime());
    newDate.setDate(date.getDate());
    return formatDateEnd(newDate);
}

export const changeStatusOrderToVietNameses = (status: string) => {
    let newStatus = '';
    switch (status) {
        case 'Unconfimred':
            newStatus = 'Chưa được xác nhận';
            break;
        case 'Confirmed':
            newStatus = 'Đã xác nhận';
            break;
        case 'Processing':
            newStatus = 'Đang xử lí';
            break;
        case 'Dispatched':
            newStatus = 'Đã gửi đi';
            break;
        case 'Cancelled':
            newStatus = 'Đã hủy';
            break;
        case 'Delivered':
            newStatus = 'Đã giao hàng';
            break;
        default:
            newStatus = 'Lỗi';
    }
    return newStatus;
};

export const changePaymentStatusToVietNameses = (status: string) => {
    let newStatus = '';
    switch (status) {
        case 'Unpaid':
            newStatus = 'Chưa thanh toán';
            break;
        case 'Paid':
            newStatus = 'Đã thanh toán';
            break;
        default:
            break;
    }
    return newStatus
}

export const changeCouponStatusToVietNameses = (status: string) => {
    let newStatus = '';
    switch (status) {
        case 'expired':
            newStatus = 'Đã hết hạn';
            break;
        case 'paused':
            newStatus = 'Đã tạm dừng';
            break;
        case 'unexpired':
            newStatus = 'Chưa hết hạn';
            break;
        default:
            break;
    }
    return newStatus
}

export const changeCouponDiscountForToVietNameses = (status: string) => {
    let newStatus = '';
    switch (status) {
        case 'order':
            newStatus = 'Giỏ hàng';
            break;
        case 'product':
            newStatus = 'Sản phẩm';
            break;
        default:
            break;
    }
    return newStatus
}

export const sendNotification = async (contentMessage: string, idSender: string,avatar: string, idReceiver?: string, orderId?: string) => {
    if (idReceiver) {
        const checkUserExists = await getDoc(doc(db, "notifications", idReceiver));
        if (!checkUserExists.exists()) {
            await setDoc(doc(db, "notifications", idReceiver), {});
        }
        await updateDoc(doc(db, "notifications", idReceiver), {
            notifications: arrayUnion({
                id: uuid(),
                contentMessage: contentMessage,
                senderId: idSender,
                date: Timestamp.now(),
                orderId: orderId ? orderId : '',
                avatar: avatar
            }),
        });
    }
    else {
        const q = query(collection(db, "users"));
        try {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (dataQuery) => {
                if (dataQuery.exists()) {
                    const userData = dataQuery.data();
                    if (userData.uid !== idSender) {
                        console.log(userData.username);
                        const checkUserExists = await getDoc(doc(db, "notifications", userData.uid));
                        if (!checkUserExists.exists()) {
                            await setDoc(doc(db, "notifications", userData.uid), {});
                        }
                        await updateDoc(doc(db, "notifications", userData.uid), {
                            messages: arrayUnion({
                                id: uuid(),
                                contentMessage: contentMessage,
                                senderId: idSender,
                                date: Timestamp.now(),
                                avatar: avatar,
                            }),
                        });
                    }
                }
            });
        } catch (err) {
            console.log(err);
        }
    }
};
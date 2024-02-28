import { Select } from 'antd';
import { UpOutlined } from '@ant-design/icons';
import './style.css';
import { useEffect, useState } from 'react';
import { INumberItemPerPage } from 'interface';

interface Iprops {
    currentPage: number;
    numberItemPerPage: INumberItemPerPage;
    handleChangeNumberItemPerPage: Function;
    siblingCount: number;
    listDataTable: Array<any>;
    handleChangePage: Function;
    optionsItemPerPage: Array<any>;
}
const Pagination = ({ currentPage, numberItemPerPage, siblingCount, listDataTable, handleChangePage, handleChangeNumberItemPerPage, optionsItemPerPage }: Iprops) => {
    const [paginationRange, setPaginationRange] = useState([] as Array<any>);

    /**
         * Tạo mảng bắt đầu từ số mong muốn
         * @author: Nguyễn Mạnh Cường - 25/08/2023
         *  @param {Number,Number} start,end
        */
    const range = (start: number, end: number) => {
        let length = end - start + 1;
        return Array.from({ length }, (_, idx) => idx + start);
    };


    /**
     * Thực hiện next đến page tiếp theo
     * @author: Nguyễn Mạnh Cường - 25/08/2023
    */
    const onNext = () => {
        if (currentPage < paginationRange[paginationRange.length - 1]) {
            handleChangePage(currentPage + 1);
        }
    };

    /**
     * Thực hiện lùi lại page trước đó
     * @author: Nguyễn Mạnh Cường - 25/08/2023 
    */
    const onPrevious = () => {
        if (currentPage > 1) {
            handleChangePage(currentPage - 1);
            // ctx.emit("handleChangePage", currentPage - 1);
        }
    };

    // #region Watch change and update
    useEffect(() => {
        const totalPageCount = Math.ceil(listDataTable.length / numberItemPerPage.value);

        const totalPageNumber = siblingCount + 5;

        if (totalPageNumber > totalPageCount) {
            setPaginationRange(range(1, totalPageCount));
            return;
        }
        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPageCount);

        const shoudShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < (totalPageCount - 2);
        const firstPageIndex = 1;
        const lastPageIndex = totalPageCount;

        if (!shoudShowLeftDots && shouldShowRightDots) {
            let leftItemCount = 3 + 2 * siblingCount;
            let leftRange = range(1, leftItemCount);
            setPaginationRange([...leftRange, '...', totalPageCount]);
            return;
        }

        if (shoudShowLeftDots && !shouldShowRightDots) {
            let rightItemCount = 3 + 2 * siblingCount;
            let rightRange = range(totalPageCount - rightItemCount + 1, totalPageCount);
            setPaginationRange([firstPageIndex, '...', ...rightRange]);
            return;
        }

        if (shoudShowLeftDots && shouldShowRightDots) {
            let middleRange = range(leftSiblingIndex, rightSiblingIndex);
            setPaginationRange([firstPageIndex, '...', ...middleRange, '...', lastPageIndex]);
            return;
        }
    }, [currentPage, numberItemPerPage.value, listDataTable.length, siblingCount]);
    // #endregion

    return (
        <div className="paging">
            <div className="m-paging-left">
                Tổng: {listDataTable ? listDataTable.length : 0} bản ghi
            </div>
            <div className="m-paging-right">
                <Select
                    className='select-pagination'
                    suffixIcon={<UpOutlined />}
                    defaultValue={optionsItemPerPage[0].value}
                    style={{ width: 160 }}
                    dropdownMatchSelectWidth={false}
                    placement='topLeft'
                    onChange={(value, option) => handleChangeNumberItemPerPage(option)}
                    options={optionsItemPerPage}
                />
                <div className="m-paging-btns">
                    <div className="m-paging-btn-icon " onClick={() => onPrevious()}>
                        Trước
                    </div >
                    {
                        paginationRange.map(item => {
                            if (item === '...') {
                                return <div key={item} className="itemPagination  dots">
                                    {item}
                                </div>;
                            }
                            return <div key={item} className={"itemPagination " + (currentPage === item ? 'active' : '')}
                                onClick={() => handleChangePage(item)}>{item}</div>;
                        })
                    }
                    <div className="m-paging-btn-icon " onClick={() => onNext()}>
                        Sau
                    </div >
                </div >
            </div>
        </div>
    );
};
export default Pagination;
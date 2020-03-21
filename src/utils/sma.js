import Store from '@/store'
export function downLoad(url){
        function getBlob(url) {
            return new Promise(resolve => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', url, true);
                xhr.setRequestHeader('authorization',Store.getters.token)
                xhr.responseType = 'blob';
                xhr.onload = () => {
                    if (xhr.status === 200) {
                        resolve(xhr.response);
                    }
                };

                xhr.send();
            });
        }

        function saveAs(blob, filename) {
            if (window.navigator.msSaveOrOpenBlob) {
                navigator.msSaveBlob(blob, filename);
            } else {
                const link = document.createElement('a');
                const body = document.querySelector('body');

                link.href = window.URL.createObjectURL(blob);
                link.download = filename;

                // fix Firefox
                link.style.display = 'none';
                body.appendChild(link);
                
                link.click();
                body.removeChild(link);

                window.URL.revokeObjectURL(link.href);
            }
        }

        function download(url, filename) {
            getBlob(url).then(blob => {
                saveAs(blob, filename);
            });
        }

        download(url,'发票模板');


    }
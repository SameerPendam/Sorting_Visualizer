class SortingVisualizer {
    constructor() {
        this.array = [];
        this.isAnimating = false;
        this.animationSpeed = 100;
        this.comparisons = 0;
        this.swaps = 0;
        this.startTime = 0;
        this.stopRequested = false;

        this.initializeElements();
        this.setupEventListeners();
        this.updateAlgorithmInfo();
    }

    initializeElements() {
        this.arrayContainer = document.getElementById('arrayContainer');
        this.generateBtn = document.getElementById('generateBtn');
        this.sortBtn = document.getElementById('sortBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.arraySize = document.getElementById('arraySize');
        this.sortSpeed = document.getElementById('sortSpeed');
        this.algorithmSelect = document.getElementById('algorithmSelect');
        this.arraySizeValue = document.getElementById('arraySizeValue');
        this.sortSpeedValue = document.getElementById('sortSpeedValue');
        this.comparisonsEl = document.getElementById('comparisons');
        this.swapsEl = document.getElementById('swaps');
        this.timeEl = document.getElementById('time');
        this.statusEl = document.getElementById('status');
        this.timeComplexityEl = document.getElementById('timeComplexity');
        this.spaceComplexityEl = document.getElementById('spaceComplexity');
        this.descriptionEl = document.getElementById('description');
    }

    setupEventListeners() {
        this.generateBtn.addEventListener('click', () => this.generateArray());
        this.sortBtn.addEventListener('click', () => this.startSorting());
        this.stopBtn.addEventListener('click', () => this.stopSorting());
        this.arraySize.addEventListener('input', (e) => {
            this.arraySizeValue.textContent = e.target.value;
            if (!this.isAnimating) this.generateArray();
        });
        this.sortSpeed.addEventListener('input', (e) => {
            this.sortSpeedValue.textContent = e.target.value;
            this.animationSpeed = 200 - (e.target.value * 18);
        });
        this.algorithmSelect.addEventListener('change', () => this.updateAlgorithmInfo());
    }

    generateArray() {
        const size = parseInt(this.arraySize.value);
        this.array = [];
        for (let i = 0; i < size; i++) {
            this.array.push(Math.floor(Math.random() * 350) + 10);
        }
        this.renderArray();
        this.resetStats();
    }

    renderArray() {
        const containerWidth = this.arrayContainer.offsetWidth - 40;
        const barWidth = Math.max(2, Math.floor(containerWidth / this.array.length) - 2);
        this.arrayContainer.innerHTML = '';
        this.array.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.className = 'array-bar default';
            bar.style.height = `${value}px`;
            bar.style.width = `${barWidth}px`;
            bar.setAttribute('data-index', index);
            this.arrayContainer.appendChild(bar);
        });
    }

    resetStats() {
        this.comparisons = 0;
        this.swaps = 0;
        this.updateStats();
        this.statusEl.textContent = 'Ready';
    }

    updateStats() {
        this.comparisonsEl.textContent = this.comparisons;
        this.swapsEl.textContent = this.swaps;
        if (this.startTime) {
            this.timeEl.textContent = `${Date.now() - this.startTime}ms`;
        }
    }

    updateAlgorithmInfo() {
        const algorithm = this.algorithmSelect.value;
        const info = {
            bubble: {
                time: 'O(n²)',
                space: 'O(1)',
                description: 'Compares adjacent elements and swaps them if they are in wrong order.'
            },
            selection: {
                time: 'O(n²)',
                space: 'O(1)',
                description: 'Finds the minimum element and places it at the beginning.'
            },
            insertion: {
                time: 'O(n²)',
                space: 'O(1)',
                description: 'Builds the sorted array one element at a time.'
            },
            quick: {
                time: 'O(n log n) avg, O(n²) worst',
                space: 'O(log n)',
                description: 'Divides array around a pivot element using recursion.'
            },
            merge: {
                time: 'O(n log n)',
                space: 'O(n)',
                description: 'Divides array into halves, sorts them, and merges them back.'
            }
        };

        this.timeComplexityEl.textContent = info[algorithm].time;
        this.spaceComplexityEl.textContent = info[algorithm].space;
        this.descriptionEl.textContent = info[algorithm].description;
    }

    async startSorting() {
        if (this.array.length === 0) {
            this.generateArray();
        }

        this.isAnimating = true;
        this.stopRequested = false;
        this.startTime = Date.now();
        this.sortBtn.disabled = true;
        this.stopBtn.disabled = false;
        this.generateBtn.disabled = true;
        this.statusEl.textContent = 'Sorting...';

        const algorithm = this.algorithmSelect.value;

        try {
            switch (algorithm) {
                case 'bubble':
                    await this.bubbleSort();
                    break;
                case 'selection':
                    await this.selectionSort();
                    break;
                case 'insertion':
                    await this.insertionSort();
                    break;
                case 'quick':
                    await this.quickSort(0, this.array.length - 1);
                    break;
                case 'merge':
                    await this.mergeSort(0, this.array.length - 1);
                    break;
            }

            if (!this.stopRequested) {
                this.statusEl.textContent = 'Completed!';
                await this.markAllAsSorted();
            }
        } catch (e) {
            this.statusEl.textContent = 'Stopped';
        }

        this.isAnimating = false;
        this.sortBtn.disabled = false;
        this.stopBtn.disabled = true;
        this.generateBtn.disabled = false;
        this.updateStats();
    }

    stopSorting() {
        this.stopRequested = true;
        this.statusEl.textContent = 'Stopping...';
    }

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async animateComparison(i, j) {
        if (this.stopRequested) throw new Error('Stop');
        const bars = this.arrayContainer.children;
        bars[i].className = 'array-bar comparing';
        bars[j].className = 'array-bar comparing';
        this.comparisons++;
        this.updateStats();
        await this.sleep(this.animationSpeed);
        bars[i].className = 'array-bar default';
        bars[j].className = 'array-bar default';
    }

    async animateSwap(i, j) {
        if (this.stopRequested) throw new Error('Stop');
        const bars = this.arrayContainer.children;
        bars[i].className = 'array-bar swapping';
        bars[j].className = 'array-bar swapping';
        [this.array[i], this.array[j]] = [this.array[j], this.array[i]];
        bars[i].style.height = `${this.array[i]}px`;
        bars[j].style.height = `${this.array[j]}px`;
        this.swaps++;
        this.updateStats();
        await this.sleep(this.animationSpeed);
        bars[i].className = 'array-bar default';
        bars[j].className = 'array-bar default';
    }

    async animatePivot(index) {
        if (this.stopRequested) throw new Error('Stop');
        const bars = this.arrayContainer.children;
        bars[index].className = 'array-bar pivot';
        await this.sleep(this.animationSpeed / 2);
    }

    async markAllAsSorted() {
        const bars = this.arrayContainer.children;
        for (let i = 0; i < bars.length; i++) {
            if (this.stopRequested) throw new Error('Stop');
            bars[i].className = 'array-bar sorted';
            await this.sleep(30);
        }
    }

    async bubbleSort() {
        const n = this.array.length;
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                await this.animateComparison(j, j + 1);
                if (this.array[j] > this.array[j + 1]) {
                    await this.animateSwap(j, j + 1);
                }
            }
        }
    }

    async selectionSort() {
        const n = this.array.length;
        for (let i = 0; i < n - 1; i++) {
            let minIdx = i;
            for (let j = i + 1; j < n; j++) {
                await this.animateComparison(minIdx, j);
                if (this.array[j] < this.array[minIdx]) {
                    minIdx = j;
                }
            }
            if (minIdx !== i) {
                await this.animateSwap(i, minIdx);
            }
        }
    }

    async insertionSort() {
        const n = this.array.length;
        for (let i = 1; i < n; i++) {
            let key = this.array[i];
            let j = i - 1;
            while (j >= 0) {
                await this.animateComparison(j, i);
                if (this.array[j] <= key) break;
                this.array[j + 1] = this.array[j];
                const bars = this.arrayContainer.children;
                bars[j + 1].style.height = `${this.array[j + 1]}px`;
                j--;
                await this.sleep(this.animationSpeed / 2);
            }
            this.array[j + 1] = key;
            const bars = this.arrayContainer.children;
            bars[j + 1].style.height = `${key}px`;
        }
    }

    async partition(low, high) {
        const pivot = this.array[high];
        await this.animatePivot(high);
        let i = low - 1;
        for (let j = low; j < high; j++) {
            await this.animateComparison(j, high);
            if (this.array[j] < pivot) {
                i++;
                if (i !== j) {
                    await this.animateSwap(i, j);
                }
            }
        }
        if (i + 1 !== high) {
            await this.animateSwap(i + 1, high);
        }
        return i + 1;
    }

    async quickSort(low, high) {
        if (low < high) {
            const pi = await this.partition(low, high);
            await this.quickSort(low, pi - 1);
            await this.quickSort(pi + 1, high);
        }
    }

    async merge(left, mid, right) {
        const leftArr = this.array.slice(left, mid + 1);
        const rightArr = this.array.slice(mid + 1, right + 1);
        let i = 0, j = 0, k = left;
        while (i < leftArr.length && j < rightArr.length) {
            await this.animateComparison(k, k);
            if (leftArr[i] <= rightArr[j]) {
                this.array[k] = leftArr[i++];
            } else {
                this.array[k] = rightArr[j++];
            }
            const bars = this.arrayContainer.children;
            bars[k].style.height = `${this.array[k]}px`;
            bars[k].className = 'array-bar swapping';
            await this.sleep(this.animationSpeed);
            bars[k].className = 'array-bar default';
            k++;
        }
        while (i < leftArr.length) {
            this.array[k] = leftArr[i++];
            const bars = this.arrayContainer.children;
            bars[k].style.height = `${this.array[k]}px`;
            k++;
        }
        while (j < rightArr.length) {
            this.array[k] = rightArr[j++];
            const bars = this.arrayContainer.children;
            bars[k].style.height = `${this.array[k]}px`;
            k++;
        }
    }

    async mergeSort(left, right) {
        if (left < right) {
            const mid = Math.floor((left + right) / 2);
            await this.mergeSort(left, mid);
            await this.mergeSort(mid + 1, right);
            await this.merge(left, mid, right);
        }
    }
}

// Init the class in index.html like:
// <script>
//   document.addEventListener('DOMContentLoaded', () => new SortingVisualizer());
// </script>

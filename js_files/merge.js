SortingVisualizer.prototype.mergeSort = async function (left, right) {
  if (left < right) {
    const mid = Math.floor((left + right) / 2);
    await this.mergeSort(left, mid);
    await this.mergeSort(mid + 1, right);
    await this.merge(left, mid, right);
  }
};

SortingVisualizer.prototype.merge = async function (left, mid, right) {
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
};

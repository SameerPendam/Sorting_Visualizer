SortingVisualizer.prototype.selectionSort = async function () {
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
};

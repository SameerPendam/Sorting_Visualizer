SortingVisualizer.prototype.bubbleSort = async function () {
  const n = this.array.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      await this.animateComparison(j, j + 1);
      if (this.array[j] > this.array[j + 1]) {
        await this.animateSwap(j, j + 1);
      }
    }
  }
};

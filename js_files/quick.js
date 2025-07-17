SortingVisualizer.prototype.quickSort = async function (low, high) {
  if (low < high) {
    const pi = await this.partition(low, high);
    await this.quickSort(low, pi - 1);
    await this.quickSort(pi + 1, high);
  }
};

SortingVisualizer.prototype.partition = async function (low, high) {
  const pivot = this.array[high];
  await this.animatePivot(high);

  let i = low - 1;
  for (let j = low; j < high; j++) {
    await this.animateComparison(j, high);
    if (this.array[j] < pivot) {
      i++;
      if (i !== j) await this.animateSwap(i, j);
    }
  }

  if (i + 1 !== high) {
    await this.animateSwap(i + 1, high);
  }

  return i + 1;
};

"use client";
import React, { use, useReducer } from "react";
import { useState } from "react";
import Chart from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

const sleep = ms => new Promise(r => setTimeout(r, ms));

const labels = Array.from({length: 50}, (value, index) => index);
  const options = {
    maintainAspectRatio: false,
    aspectRatio: 1,
    plugins: {
      maintainAspectRatio: false,
      aspectRatio: 1,
      datalabels: {
        color: "black",
        labels: {
          title: {
            font: {
              weight: "bold"
            }
          }
        },
        anchor: "end",
        align: "-90"
      },
      legend: {
        position: "bottom",
        labels: {
          boxHeight: 10,
          boxWidth: 5
        }
      }
    }
  };

const DrawGraph = ({pData, pLabel, pColor}) => {
    const data = {
        labels: labels,
        datasets: [
          {
            label: pLabel,
            backgroundColor: pColor,
            data: pData,
            fill: false
          }
        ]
      };
    return (
        <Bar data={data} plugins={[ChartDataLabels]} options={options}/>
    );
}

const BarChart = () => {
  let dataItems = Array.from({length: 50}, () => Math.ceil(Math.random() * 100));
  const [selectionSortValues, setSelectionSortValues] = useState([...dataItems]);
  const [insertionSortValues, setInsertionSortValues] = useState([...dataItems]);
  const [heapSortValues, setHeapSortValues] = useState([...dataItems]);
  const [shellSortValues, setShellSortValues] = useState([...dataItems]);

  const [selectionCount, incSelectionCount] = useReducer((x) => x+1, 0);
  const [insertionCount, incInsertionCount] = useReducer((x) => x+1, 0);
  const [heapCount, incHeapCount] = useReducer((x) => x+1, 0);
  const [shellCount, incShellCount] = useReducer((x) => x+1, 0);

  async function heapify(arr, index, length = arr.length) {
    let largest = index,
        left = index * 2 + 1,
        right = index * 2 + 2;

    // compare element to its left and right child 
    if (left < length && arr[left] > arr[largest]) {
        largest = left;
    }
    if (right < length && arr[right] > arr[largest]) {
        largest = right;
    }

    // if the parent node isn't the largest element, swap it with the largest child
    if (largest !== index) {
        Swap(arr, index, largest, setHeapSortValues);

        // continue to heapify down the heap
        await sleep(50);
        incHeapCount();
        await heapify(arr, largest, length);
    }
}

  const Swap = (arr, x, y, valFunc) => {
    [arr[x], arr[y]] = [arr[y], arr[x]];
    valFunc([...arr]);
  }

  const ShellSort = async (arr) => {
    let n = arr.length;
 
    // Start with a big gap, then reduce the gap
    for (let gap = Math.floor(n/2); gap > 0; gap = Math.floor(gap/2)){
        // Do a gapped insertion sort for this gap size.
        // The first gap elements a[0..gap-1] are already
        // in gapped order keep adding one more element
        // until the entire array is gap sorted
        for (let i = gap; i < n; i += 1) {
            // add a[i] to the elements that have been gap
            // sorted save a[i] in temp and make a hole at
            // position i
            let temp = arr[i];

            // shift earlier gap-sorted elements up until
            // the correct location for a[i] is found
            let j;
            for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
                await sleep(50);
                incShellCount();
                arr[j] = arr[j - gap];
                setShellSortValues([...arr]);
            }

            // put temp (the original a[i]) in its correct location
            arr[j] = temp;
            setShellSortValues([...arr]);
        }
    }
  }

  const HeapSort = async (arr) => {
    // max heapify the array
    for (let i = Math.floor(arr.length / 2); i >= 0; i--) {
      await heapify(arr, i)
    }

    // work backwards, moving max elements to the end of the array
    for(let i = arr.length - 1; i > 0; i--){
      // max element of unsorted section of array is at index 0, swap with element at last index in unsorted array
      Swap(arr, 0, i, setHeapSortValues);
      await sleep(50);
      incHeapCount();

      // re-heapify array, from beginning to the end of the unsorted section
      await heapify(arr, 0, i);
    }
  }

  const SelectionSort = async (arr, setSelectionSortValues) => {
    let n = arr.length;       
    // Variable to store index of smallest value 
    let min; 
    // variables to iterate the array 
    let i , j;     
    for( i = 0; i < n-1;++i){ 
        min = i; 
        for(j = i+1; j < n; j++){ 
            if(arr[j]<arr[min]) {
                min = j; 
            }
            incSelectionCount();
            await sleep(50);
        } 
        // Swap if both index are different 
        if(min!=i) {
            Swap(arr,min,i,setSelectionSortValues); 
        }
    } 
  }

  const InsertionSort = async (arr) => {
    let n = arr.length;
    
    for (let i=1; i < n; ++i) {
      let currentVal = arr[i];
      let j;
      for (j = i - 1; j >= 0 && arr[j] > currentVal; j--) {
        arr[j + 1] = arr[j];
        incInsertionCount();
        await sleep(50);
      }
      arr[j + 1] = currentVal;
      setInsertionSortValues([...arr]);
    }      
  }

  return (
    <table style={{width:'90%', backgroundColor: 'white', color:'black'}}>
      <thead>
        <tr>
          <th style={{border: "1px solid black"}}>Graph</th>
          <th style={{border: "1px solid black"}}>Time</th>
          <th style={{border: "1px solid black"}}>Sort</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{textAlign: "center", border: "1px solid black"}}>
            <DrawGraph pData={selectionSortValues} pLabel="Selection Sort" pColor='red'/>
          </td>
          <td style={{width: '5%', textAlign: "center", border: "1px solid black"}}>{selectionCount} units</td>
          <td style={{width:'10%', textAlign: "center", border: "1px solid black"}}>
            <button 
              className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded" 
              onClick={() => SelectionSort(selectionSortValues, setSelectionSortValues)}
            >Sort</button>
          </td>
        </tr>
        <tr>
          <td style={{textAlign: "center", border: "1px solid black"}}>
            <DrawGraph pData={insertionSortValues} pLabel="Insertion Sort" pColor='red'/>
          </td>
          <td style={{textAlign: "center", border: "1px solid black"}}>{insertionCount} units</td>
          <td style={{width:'10%', textAlign: "center", border: "1px solid black"}}>
            <button 
              className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded" 
              onClick={() => InsertionSort(insertionSortValues, setInsertionSortValues)}
            >Sort</button>
          </td>
        </tr>        
        <tr>
          <td style={{textAlign: "center", border: "1px solid black"}}>
            <DrawGraph pData={heapSortValues} pLabel="Heap Sort" pColor='red'/>
          </td>
          <td style={{textAlign: "center", border: "1px solid black"}}>{heapCount} units</td>
          <td style={{width:'10%', textAlign: "center", border: "1px solid black"}}>
            <button 
              className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded" 
              onClick={() => HeapSort(heapSortValues, setHeapSortValues)}
            >Sort</button>
          </td>
        </tr>   
        <tr>
          <td style={{textAlign: "center", border: "1px solid black"}}>
            <DrawGraph pData={shellSortValues} pLabel="Shell Sort" pColor='red'/>
          </td>
          <td style={{textAlign: "center", border: "1px solid black"}}>{shellCount} units</td>
          <td style={{width:'10%', textAlign: "center", border: "1px solid black"}}>
            <button 
              className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded" 
              onClick={() => ShellSort(shellSortValues, setShellSortValues)}
            >Sort</button>
          </td>
        </tr>               
      </tbody>
    </table>
  );
};

export default BarChart;
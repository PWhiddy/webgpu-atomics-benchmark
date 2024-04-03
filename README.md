### WebGPU Atomics Benchmark

A simple test of the throughput of atomics on your gpu using webgpu.

*PRs adding results for your GPU are welcome!*


----

Current configuration is 32 atomic adds per thread, launching a total of 15M threads.

| GPU | Max Bandwidth | Ops/s | Bandwidth Utilization | 
|----- | ----- | ----- | ----- |
|M1 Max | 400 GB/s | 20B | 40% |
| RTX 4090 | 1008 GB/s | 62B | 49% |


----

To calculate results for your GPU use the formula:

```python
operations_per_second = # your result here
gpu_max_bandwidth = # your gpu max bandwidth (look this up online)
bandwidth_utilized = ((operations_per_second * 4 * 2) / gpu_max_bandwidth) * 100
```


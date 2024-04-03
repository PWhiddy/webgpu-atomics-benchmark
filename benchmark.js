async function benchmarkAtomicAdd() {
    
    const res = document.getElementById("results");

    if (!navigator.gpu) {
        res.innerText = "WebGPU is not supported in this browser.";
        return;
    }

    const adapter = await navigator.gpu.requestAdapter();
    const device = await adapter.requestDevice();

    const numElements = 1; // A single element for the atomic counter
    const bufferSize = numElements * Uint32Array.BYTES_PER_ELEMENT;

    const counterBuffer = device.createBuffer({
        size: bufferSize,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
        mappedAtCreation: true
    });
    new Uint32Array(counterBuffer.getMappedRange()).fill(0);
    counterBuffer.unmap();

    const bindGroupLayout = device.createBindGroupLayout({
        entries: [{
            binding: 0,
            visibility: GPUShaderStage.COMPUTE,
            buffer: {
                type: 'storage',
            },
        }],
    });

    const pipelineLayout = device.createPipelineLayout({
        bindGroupLayouts: [bindGroupLayout],
    });

    const shaderModule = device.createShaderModule({
        code: `
            @group(0) @binding(0) var<storage, read_write> counter : atomic<u32>;
            //@group(0) @binding(0) var<storage, read_write> counter : u32;

            @compute @workgroup_size(256)
            fn main() {
                // test 8 * 4 = 32 increment ops
                var x = atomicAdd(&counter, 1u);
                x = atomicAdd(&counter, x >> 16);
                x = atomicAdd(&counter, x >> 16);
                x = atomicAdd(&counter, x >> 16);
                x = atomicAdd(&counter, x >> 16);
                x = atomicAdd(&counter, x >> 16);
                x = atomicAdd(&counter, x >> 16);
                x = atomicAdd(&counter, x >> 16);

                x = atomicAdd(&counter, x >> 16);
                x = atomicAdd(&counter, x >> 16);
                x = atomicAdd(&counter, x >> 16);
                x = atomicAdd(&counter, x >> 16);
                x = atomicAdd(&counter, x >> 16);
                x = atomicAdd(&counter, x >> 16);
                x = atomicAdd(&counter, x >> 16);
                x = atomicAdd(&counter, x >> 16);

                x = atomicAdd(&counter, x >> 16);
                x = atomicAdd(&counter, x >> 16);
                x = atomicAdd(&counter, x >> 16);
                x = atomicAdd(&counter, x >> 16);
                x = atomicAdd(&counter, x >> 16);
                x = atomicAdd(&counter, x >> 16);
                x = atomicAdd(&counter, x >> 16);
                x = atomicAdd(&counter, x >> 16);

                x = atomicAdd(&counter, x >> 16);
                x = atomicAdd(&counter, x >> 16);
                x = atomicAdd(&counter, x >> 16);
                x = atomicAdd(&counter, x >> 16);
                x = atomicAdd(&counter, x >> 16);
                x = atomicAdd(&counter, x >> 16);
                x = atomicAdd(&counter, x >> 16);
                x = atomicAdd(&counter, x >> 16);
                
                /*
                // you can increase the number of non-atomic increments to
                // many hundreds before the kernel time (including overhead)
                // increases noticeably at all
                counter += 1u;
                counter += 1u;
                counter += 1u;
                counter += 1u;
                counter += 1u;
                counter += 1u;
                counter += 1u;
                counter += 1u;

                counter += 1u;
                counter += 1u;
                counter += 1u;
                counter += 1u;
                counter += 1u;
                counter += 1u;
                counter += 1u;
                counter += 1u;
                
                counter += 1u;
                counter += 1u;
                counter += 1u;
                counter += 1u;
                counter += 1u;
                counter += 1u;
                counter += 1u;
                counter += 1u;

                counter += 1u;
                counter += 1u;
                counter += 1u;
                counter += 1u;
                counter += 1u;
                counter += 1u;
                counter += 1u;
                counter += 1u;
                */
            }
        `
    });

    const pipeline = device.createComputePipeline({
        layout: pipelineLayout,
        compute: {
            module: shaderModule,
            entryPoint: 'main',
        },
    });

    const bindGroup = device.createBindGroup({
        layout: bindGroupLayout,
        entries: [{
            binding: 0,
            resource: {
                buffer: counterBuffer,
            },
        }],
    });

    const readBuffer = device.createBuffer({
        size: bufferSize,
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });

    const numIterations = 20; 
    let totalDuration = 0;

    const numThreads = 15000000;
    const workgroupSize = 256;

    for (let i = 0; i < numIterations; i++) {
        const commandEncoder = device.createCommandEncoder();
        const passEncoder = commandEncoder.beginComputePass();
        passEncoder.setPipeline(pipeline);
        passEncoder.setBindGroup(0, bindGroup);

        const numGroups = Math.ceil(numThreads / workgroupSize);
        const start = performance.now();
        passEncoder.dispatchWorkgroups(numGroups);
        passEncoder.end();
        commandEncoder.copyBufferToBuffer(counterBuffer, 0, readBuffer, 0, bufferSize);
        const gpuCommands = commandEncoder.finish();
        device.queue.submit([gpuCommands]);

        await device.queue.onSubmittedWorkDone();
        const duration = performance.now() - start;
        totalDuration += duration;
        console.log(`Iteration ${i + 1}: ${duration.toFixed(2)} ms`);
    }

    const averageDuration = totalDuration / numIterations;
    console.log(`Average kernel execution time: ${averageDuration.toFixed(2)} ms`);
    console.log(`Operations per second: ${ numThreads * 32 * 1000 / averageDuration }`);
    
    const resultText = `
    Average kernel execution time: ${averageDuration.toFixed(2)} ms 
    
    Operations per second: ${ numThreads * 32 * 1000 / averageDuration }
    `;
    res.innerText = resultText;
    await readBuffer.mapAsync(GPUMapMode.READ);
    const arrayBuffer = readBuffer.getMappedRange();
    const result = new Uint32Array(arrayBuffer);
    console.log(`Counter at end: ${result[0]}`);

    readBuffer.unmap();
    readBuffer.destroy();
    counterBuffer.destroy();
}

benchmarkAtomicAdd().catch(console.error);

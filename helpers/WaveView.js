import * as util from './util/index'

export class WaveView {
    constructor(set) {
        var This = this;
        var o = {
            scale: 2, //缩放系数，应为正整数，使用2(3? no!)倍宽高进行绘制，避免移动端绘制模糊
            speed: 8, //移动速度系数，越大越快
            lineWidth: 3, //线条基础粗细
            //渐变色配置：[位置，css颜色，...] 位置: 取值0.0-1.0之间
            linear1: [0, "rgba(150,96,238,1)", 0.2, "rgba(170,79,249,1)", 1, "rgba(53,199,253,1)"], //线条渐变色1，从左到右
            linear2: [0, "rgba(209,130,255,0.6)", 1, "rgba(53,199,255,0.6)"], //线条渐变色2，从左到右
            linearBg: [0, "rgba(255,255,255,0.2)", 1, "rgba(54,197,252,0.2)"] //背景渐变色，从上到下
        };
        for (var k in set) {
            o[k] = set[k];
        };
        This.set = set = o;
        var scale = set.scale;
        var width = set.width * scale;
        var height = set.height * scale;
        var canvas = set.elem;
        canvas.width = width;
        canvas.height = height;
        var ctx = This.ctx = canvas.getContext("2d");
        This.linear1 = This.genLinear(ctx, width, set.linear1);
        This.linear2 = This.genLinear(ctx, width, set.linear2);
        This.linearBg = This.genLinear(ctx, height, set.linearBg, true);
        This._phase = 0;
    
        This.peaks = null;
        This.buffer = null;
        This.splitPeaks = [];
        This.mergedPeaks = null;
    }
    genLinear(ctx, size, colors, top) {
        var rtv = ctx.createLinearGradient(0, 0, top ? 0 : size, top ? size : 0);
        for (var i = 0; i < colors.length;) {
            rtv.addColorStop(colors[i++], colors[i++]);
        };
        return rtv;
    }
    genPath(frequency, amplitude, phase) {
        //曲线生成算法参考 https://github.com/HaloMartin/MCVoiceWave/blob/f6dc28975fbe0f7fc6cc4dbc2e61b0aa5574e9bc/MCVoiceWave/MCVoiceWaveView.m#L268
        var rtv = [];
        var This = this,
            set = This.set;
        var scale = set.scale;
        var width = set.width * scale;
        var maxAmplitude = set.height * scale / 2;

        for (var x = 0; x < width; x += scale) {
            var scaling = (1 + Math.cos(Math.PI + (x / width) * 2 * Math.PI)) / 2;
            var y = scaling * maxAmplitude * amplitude * Math.sin(2 * Math.PI * (x / width) * frequency + phase) + maxAmplitude;
            rtv.push(y);
        }
        return rtv;
    }
    input(dataLength = 4096, powerLevel = 40, sampleRate = 16000) {
        var This = this,
            set = This.set;
        var ctx = This.ctx;
        var scale = set.scale;
        var width = set.width * scale;
        var height = set.height * scale; //set.height * scale
        var speedx = set.speed * dataLength / sampleRate;
        var phase = This._phase -= speedx; //位移速度
        var amplitude = powerLevel / 100;
        var path1 = This.genPath(2, amplitude, phase);
        var path2 = This.genPath(1.8, amplitude, phase + speedx * 5);
        //开始绘制图形
        ctx.clearRect(0, 0, width, height);
        //绘制包围背景
        ctx.beginPath();
        console.log("pathWidth", width)
        for (var i = 0, x = 0; x < width; i++, x += scale) {
            if (x == 0) {
                ctx.moveTo(x, path1[i]);
            } else {
                ctx.lineTo(x, path1[i]);
            };
        };
        i--;
        for (var x = width - 1; x >= 0; i--, x -= scale) {
            ctx.lineTo(x, path2[i]);
        };
        ctx.closePath();
        ctx.fillStyle = This.linearBg;
        ctx.fill();
        //绘制线
        This.drawPath(path2, This.linear2);
        This.drawPath(path1, This.linear1);
    }
    drawPath(path, linear) {
        var This = this,
            set = This.set;
        var ctx = This.ctx;
        var scale = set.scale;
        var width = set.width * scale;
        ctx.beginPath();
        for (var i = 0, x = 0; x < width; i++, x += scale) {
            if (x == 0) {
                ctx.moveTo(x, path[i]);
            } else {
                ctx.lineTo(x, path[i]);
            };
        };
        ctx.lineWidth = set.lineWidth * scale;
        ctx.strokeStyle = linear;
        ctx.stroke();
    }
    fillRect(x, y, width, height, radius, channelIndex) {
        var This = this;
        var set = This.set;
        var ctx = This.ctx;
        // var scale = 1.0;
        // var width = set.width * scale;
        // var height = set.height * scale; //set.height * scale
        // ctx.clearRect(0, 0, width, height);

        ctx.fillStyle = "#FF0000"; 　
        ctx.fillRect( x, y, width, height);
    }

    demoBuffer(buffer) {
        console.log("demoBuffer", buffer);

        var width = 200;

        var This = this;
        var set = This.set;
        var ctx = This.ctx;
        var scale = 1.0;
        var width = set.width * scale;
        var height = set.height * scale; //set.height * scale //// 控制着最高的柱子的高度
        console.log("width, height", width, height);
        This.set.h = height;
        ctx.clearRect(0, 0, width, height);

        var start = 0;
        var end = width;

        this.buffer = buffer;
        var peaks;
        peaks = this.getPeaks(width, start, end);

        // var channels = peaks;
        // channels.map(function (channelPeaks) {
        //     return util.absMax(channelPeaks);
        // })
        // util.max([0, 1, 2, 3]);

        //absmax = normalizedMax === undefined ? util.absMax(peaks) : normalizedMax;
        var absmax = util.absMax(peaks);

        // overallAbsMax = util.max(channels.map(function (channelPeaks) {
        //     return util.absMax(channelPeaks);//channelPeaks中的最大值
        //   }));

        this.drawBars(peaks, width, start, end);
        //console.log( util.absMax([0, 1, 2, 3]) )
    }
    
    getPeaks(length, first, last) {
        if (this.peaks) {
            return this.peaks;
        }

        if (!this.buffer) {
            return [];
        }

        first = first || 0;
        last = last || length - 1;
        this.setLength(length);

        // if (!this.buffer) {
        //     return this.params.splitChannels ? this.splitPeaks : this.mergedPeaks;
        // }
        
        if (!this.buffer.length) {
            var newBuffer = this.createBuffer(1, 4096, this.sampleRate);
            this.buffer = newBuffer.buffer;
        }
        var sampleSize = this.buffer.length / length;
        var sampleStep = ~~(sampleSize / 10) || 1;
        var channels = this.buffer.numberOfChannels;
        var c;

        for (c = 0; c < channels; c++) {
            var peaks = this.splitPeaks[c];
            var chan = this.buffer.getChannelData(c);
            console.log("chan", chan, "peaks", peaks);
            var i = void 0;
    
            for (i = first; i <= last; i++) {
              var start = ~~(i * sampleSize);
              var end = ~~(start + sampleSize);
              /**
               * Initialize the max and min to the first sample of this
               * subrange, so that even if the samples are entirely
               * on one side of zero, we still return the true max and
               * min values in the subrange.
               */
    
              var min = chan[start];
              var max = min;
              var j = void 0;
    
              for (j = start; j < end; j += sampleStep) {
                var value = chan[j];
    
                if (value > max) {
                  max = value;
                }
    
                if (value < min) {
                  min = value;
                }
              }
    
              peaks[2 * i] = max;
              peaks[2 * i + 1] = min;
    
              if (c == 0 || max > this.mergedPeaks[2 * i]) {
                this.mergedPeaks[2 * i] = max;
              }
    
              if (c == 0 || min < this.mergedPeaks[2 * i + 1]) {
                this.mergedPeaks[2 * i + 1] = min;
              }
            }
          }
          //return this.params.splitChannels ? this.splitPeaks : this.mergedPeaks;
          return false ? this.splitPeaks : this.mergedPeaks;

    }
    drawBars(peaks, channelIndex, start, end) {
        var first = start;
        var last = end;
        var peakIndex = first;
        var bar = 4; //2pixel
        var gap = 2; //1pixel
        var step = bar + gap;
        var length = peaks.length / peakIndexScale;
        var scale = 1.0;
        var peakIndexScale = 2;

        var absmax = util.absMax(peaks);

        var halfH = this.set.h / 2;

        for (peakIndex; peakIndex < last; peakIndex += step) {
            var peak = 0;
            var peakIndexRange = Math.floor(peakIndex * scale) * peakIndexScale;
            var peakIndexEnd = Math.floor((peakIndex + step) * scale) * peakIndexScale;

            do {
                // do..while makes sure at least one peak is always evaluated
                var newPeak = Math.abs(peaks[peakIndexRange]); // for arrays starting with negative values
    
                if (newPeak > peak) {
                  peak = newPeak; // higher
                }
    
                peakIndexRange += peakIndexScale; // skip every other value for negatives
            } while (peakIndexRange < peakIndexEnd); // calculate the height of this bar according to the highest peak found
            //得出区块中的peaks

            //这里控制着最高的高度..把所有的缩小n倍可以正常缩小
            var h = Math.round(peak / absmax * halfH); // in case of silences, allow the user to specify that we

            //控制着最小的柱体的高度
            // if (h == 0 && _this4.params.barMinHeight) {
            //     h = _this4.params.barMinHeight;
            // }

            /* draw */
            //console.log("Draw", peakIndex, h);
            var offsetY = 0;//this.set.h
            var halfPixel = 1;
            this.fillRect(peakIndex + halfPixel, halfH - h + offsetY, bar + halfPixel, h * 2);
        }


    }

    setLength(length) {
      // No resize, we can preserve the cached peaks.
      if (this.mergedPeaks && length == 2 * this.mergedPeaks.length - 1 + 2) {
        return;
      }
      this.splitPeaks = [];
      this.mergedPeaks = []; // Set the last element of the sparse array so the peak arrays are
      // appropriately sized for other calculations.

      var channels = this.buffer ? this.buffer.numberOfChannels : 1;
      var c;
      for (c = 0; c < channels; c++) {
        this.splitPeaks[c] = [];
        this.splitPeaks[c][2 * (length - 1)] = 0;
        this.splitPeaks[c][2 * (length - 1) + 1] = 0;
      }

      this.mergedPeaks[2 * (length - 1)] = 0;
      this.mergedPeaks[2 * (length - 1) + 1] = 0;
    }
}
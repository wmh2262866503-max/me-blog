import React, { useEffect, useRef } from 'react';

export default function AdminBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    // 浮动气泡粒子
    const bubbles = [];
    const bubbleCount = 30;

    for (let i = 0; i < bubbleCount; i++) {
      bubbles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 40 + 20,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        color: Math.random() > 0.5 ? 'rgba(147, 197, 253, 0.15)' : 'rgba(196, 181, 253, 0.15)',
        pulseSpeed: Math.random() * 0.02 + 0.01
      });
    }

    // 流动的波浪线
    const waves = [
      { amplitude: 30, frequency: 0.02, speed: 0.5, yOffset: 0.2, color: 'rgba(147, 197, 253, 0.2)' },
      { amplitude: 25, frequency: 0.025, speed: 0.7, yOffset: 0.4, color: 'rgba(196, 181, 253, 0.2)' },
      { amplitude: 20, frequency: 0.03, speed: 0.6, yOffset: 0.6, color: 'rgba(167, 243, 208, 0.2)' }
    ];

    const animate = () => {
      time += 0.01;

      // 清空画布 - 使用浅色背景
      ctx.fillStyle = 'rgba(249, 250, 251, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 绘制柔和的网格
      ctx.strokeStyle = 'rgba(147, 197, 253, 0.08)';
      ctx.lineWidth = 1;

      const gridSize = 60;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // 绘制流动的波浪线
      waves.forEach(wave => {
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = 3;
        ctx.beginPath();

        for (let x = 0; x < canvas.width; x += 5) {
          const y = canvas.height * wave.yOffset +
                    Math.sin(x * wave.frequency + time * wave.speed) * wave.amplitude;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });

      // 更新和绘制气泡
      bubbles.forEach(bubble => {
        // 移动气泡
        bubble.x += bubble.vx;
        bubble.y += bubble.vy;

        // 边界反弹
        if (bubble.x - bubble.radius < 0 || bubble.x + bubble.radius > canvas.width) {
          bubble.vx *= -1;
        }
        if (bubble.y - bubble.radius < 0 || bubble.y + bubble.radius > canvas.height) {
          bubble.vy *= -1;
        }

        // 脉动效果
        const pulseRadius = bubble.radius + Math.sin(time * 2 + bubble.x) * 5;

        // 绘制气泡渐变
        const gradient = ctx.createRadialGradient(
          bubble.x, bubble.y, 0,
          bubble.x, bubble.y, pulseRadius
        );
        gradient.addColorStop(0, bubble.color.replace('0.15', '0.25'));
        gradient.addColorStop(0.5, bubble.color);
        gradient.addColorStop(1, bubble.color.replace('0.15', '0'));

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, pulseRadius, 0, Math.PI * 2);
        ctx.fill();

        // 气泡边框
        ctx.strokeStyle = bubble.color.replace('0.15', '0.3');
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, pulseRadius * 0.8, 0, Math.PI * 2);
        ctx.stroke();
      });

      // 绘制漂浮的光点
      for (let i = 0; i < 20; i++) {
        const x = (time * 20 + i * 100) % canvas.width;
        const y = canvas.height * 0.3 + Math.sin(time + i) * 50;
        const size = 2 + Math.sin(time * 2 + i) * 1;

        ctx.fillStyle = `rgba(147, 197, 253, ${0.4 + Math.sin(time * 3 + i) * 0.3})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // 绘制渐变光晕
      const glowGradient = ctx.createRadialGradient(
        canvas.width * 0.7, canvas.height * 0.3, 0,
        canvas.width * 0.7, canvas.height * 0.3, 300
      );
      glowGradient.addColorStop(0, 'rgba(196, 181, 253, 0.1)');
      glowGradient.addColorStop(1, 'rgba(196, 181, 253, 0)');

      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(canvas.width * 0.7, canvas.height * 0.3, 300, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

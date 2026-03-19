import React, { useEffect, useRef } from 'react';

export default function CyberBackground() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

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

    // 鼠标事件监听
    const handleMouseMove = (e) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
        active: true
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // 粒子系统
    const particles = [];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        baseX: 0,
        baseY: 0
      });
    }

    const animate = () => {
      time += 0.01;

      // 清空画布，使用半透明黑色实现拖尾效果
      ctx.fillStyle = 'rgba(249, 250, 251, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const mouse = mouseRef.current;

      // 绘制网格
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)';
      ctx.lineWidth = 1;

      const gridSize = 50;
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

      // 绘制动态霓虹线条（受鼠标影响）
      ctx.strokeStyle = `rgba(139, 92, 246, ${0.3 + Math.sin(time) * 0.2})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x += 10) {
        let y = canvas.height / 2 + Math.sin(x * 0.01 + time) * 50;

        // 鼠标影响
        if (mouse.active) {
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 200) {
            y += (mouse.y - y) * 0.1 * (1 - distance / 200);
          }
        }

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // 绘制第二条霓虹线（受鼠标影响）
      ctx.strokeStyle = `rgba(59, 130, 246, ${0.3 + Math.cos(time) * 0.2})`;
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x += 10) {
        let y = canvas.height / 3 + Math.cos(x * 0.015 + time * 1.5) * 40;

        // 鼠标影响
        if (mouse.active) {
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 200) {
            y += (mouse.y - y) * 0.15 * (1 - distance / 200);
          }
        }

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // 鼠标光晕效果
      if (mouse.active) {
        const gradient = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, 80
        );
        gradient.addColorStop(0, 'rgba(139, 92, 246, 0.08)');
        gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.04)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 80, 0, Math.PI * 2);
        ctx.fill();

        // 鼠标中心点
        ctx.fillStyle = `rgba(139, 92, 246, ${0.4 + Math.sin(time * 3) * 0.2})`;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 2, 0, Math.PI * 2);
        ctx.fill();

        // 鼠标涟漪效果
        ctx.strokeStyle = `rgba(139, 92, 246, ${0.15 - (time % 1) * 0.15})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, (time % 1) * 60, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 更新和绘制粒子（受鼠标影响）
      particles.forEach(particle => {
        // 基础移动
        particle.x += particle.vx;
        particle.y += particle.vy;

        // 鼠标吸引/排斥效果
        if (mouse.active) {
          const dx = mouse.x - particle.x;
          const dy = mouse.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 200) {
            // 吸引效果
            const force = (1 - distance / 200) * 0.5;
            particle.vx += (dx / distance) * force;
            particle.vy += (dy / distance) * force;
          }
        }

        // 速度衰减
        particle.vx *= 0.98;
        particle.vy *= 0.98;

        // 边界反弹
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.vx *= -1;
          particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.vy *= -1;
          particle.y = Math.max(0, Math.min(canvas.height, particle.y));
        }

        // 绘制粒子
        const distanceToMouse = mouse.active
          ? Math.sqrt(Math.pow(mouse.x - particle.x, 2) + Math.pow(mouse.y - particle.y, 2))
          : 999;

        const alpha = distanceToMouse < 150
          ? 0.8
          : 0.5 + Math.sin(time + particle.x) * 0.3;

        ctx.fillStyle = `rgba(139, 92, 246, ${alpha})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // 鼠标附近的粒子发光
        if (distanceToMouse < 150) {
          ctx.fillStyle = `rgba(139, 92, 246, ${0.3 * (1 - distanceToMouse / 150)})`;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 绘制连接线
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.1)';
      ctx.lineWidth = 1;
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      // 粒子与鼠标的连接线
      if (mouse.active) {
        particles.forEach(particle => {
          const dx = mouse.x - particle.x;
          const dy = mouse.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.3 * (1 - distance / 150)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        });
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      />
      {/* 扫描线效果 */}
      <div className="fixed inset-0 pointer-events-none cyber-scanlines" style={{ zIndex: 1 }} />
    </>
  );
}

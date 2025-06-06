import { Module } from '../../shared/Module';
import options from 'src/options';
import { inputHandler } from 'src/components/bar/utils/helpers';
import { computeCPU } from './helpers';
import { FunctionPoller } from 'src/lib/poller/FunctionPoller';
import { bind, Variable } from 'astal';
import { Astal } from 'astal/gtk3';
import { BarBoxChild } from 'src/lib/types/bar.types';

const { label, round, leftClick, rightClick, middleClick, scrollUp, scrollDown, pollingInterval, icon } =
    options.bar.customModules.cpu;

export const cpuUsage = Variable(0);

const cpuPoller = new FunctionPoller<number, []>(cpuUsage, [bind(round)], bind(pollingInterval), computeCPU);

cpuPoller.initialize('cpu');

export const Cpu = (): BarBoxChild => {
    const labelBinding = Variable.derive([bind(cpuUsage), bind(round)], (cpuUsg: number, round: boolean) => {
        return round ? `${Math.round(cpuUsg)}%` : `${cpuUsg.toFixed(2)}%`;
    });

    const cpuModule = Module({
        textIcon: bind(icon),
        label: labelBinding(),
        tooltipText: 'CPU',
        boxClass: 'cpu',
        showLabelBinding: bind(label),
        props: {
            setup: (self: Astal.Button) => {
                inputHandler(self, {
                    onPrimaryClick: {
                        cmd: leftClick,
                    },
                    onSecondaryClick: {
                        cmd: rightClick,
                    },
                    onMiddleClick: {
                        cmd: middleClick,
                    },
                    onScrollUp: {
                        cmd: scrollUp,
                    },
                    onScrollDown: {
                        cmd: scrollDown,
                    },
                });
            },
            onDestroy: () => {
                labelBinding.drop();
            },
        },
    });

    return cpuModule;
};

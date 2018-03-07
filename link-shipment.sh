#!/usr/bin/env bash

rm -rf ./node_modules/shipment
ln -nfs ../../shipment-next ./node_modules/shipment

rm -rf ./node_modules/shipment-monitor-process
ln -nfs ../../shipment-monitor-process ./node_modules/shipment-monitor-process
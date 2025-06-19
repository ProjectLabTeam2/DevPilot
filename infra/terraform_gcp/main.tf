provider "google" {
  credentials = file("~/.gcp/jenkins-terraform.json")
  project     = var.project
  region      = var.region
  zone        = var.zone
}

module "networking" {
  source = "./modules/networking"
  region = var.region
}

module "jenkins_vm" {
  source         = "./modules/jenkins_vm"
  region         = var.region
  zone           = var.zone
  network        = module.networking.network
  subnetwork     = module.networking.subnetwork
  tags           = ["jenkins"]
}
